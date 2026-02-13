import { ChangeDetectionStrategy, Component, effect, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { Dialog } from '../../../shared/dialog/dialog';
import { Bookshelf } from '../../../core/models/bookshelf';

@Component({
    selector: 'app-update-bookshelf',
    imports: [CommonModule, ReactiveFormsModule, Dialog],
    templateUrl: './update-bookshelf.html',
    styleUrl: './update-bookshelf.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateBookshelf {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly bookshelfService = inject(BookshelfService);

    readonly isDialogOpen: InputSignal<boolean> = input<boolean>(false);
    readonly bookshelf: InputSignal<Bookshelf | null> = input<Bookshelf | null>(null);
    readonly requestClose: OutputEmitterRef<Bookshelf | null> = output<Bookshelf | null>();

    readonly dialogTitle = 'Update Bookshelf';

    readonly bookshelfForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
        image: ['', [Validators.required, Validators.minLength(1)]],
    });

    private readonly nameControl = this.bookshelfForm.controls.name;
    private readonly imageControl = this.bookshelfForm.controls.image;

    constructor() {
        effect(() => {
            if (this.isDialogOpen()) {
                const shelf = this.bookshelf();
                if (shelf) {
                    this.bookshelfForm.patchValue({ name: shelf.name, image: shelf.image });
                }
            }
        });
    }

    nameHasError(): boolean {
        return this.nameControl.invalid && (this.nameControl.touched || this.nameControl.dirty);
    }

    imageHasError(): boolean {
        return this.imageControl.invalid && (this.imageControl.touched || this.imageControl.dirty);
    }

    closeDialog(): void {
        this.requestClose.emit(null);
        this.bookshelfForm.reset();
    }

    onSave(): void {
        if (this.bookshelfForm.invalid) {
            this.bookshelfForm.markAllAsTouched();
            return;
        }

        const name = this.nameControl.value.trim();
        const image = this.imageControl.value.trim();

        if (!name) {
            this.nameControl.setErrors({ required: true });
            return;
        }

        if (!image) {
            this.imageControl.setErrors({ required: true });
            return;
        }

        const shelf = this.bookshelf();
        if (!shelf) {
            return;
        }

        this.bookshelfService.updateBookshelf(shelf.id, name, image);

        const updatedShelf: Bookshelf = { ...shelf, name, image };
        this.requestClose.emit(updatedShelf);
        this.bookshelfForm.reset();
    }
}

