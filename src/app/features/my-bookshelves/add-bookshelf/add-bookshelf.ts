import { ChangeDetectionStrategy, Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { UserService } from '../../../core/services/user-service';
import { Dialog } from '../../../shared/dialog/dialog';

@Component({
    selector: 'app-add-bookshelf',
    imports: [CommonModule, ReactiveFormsModule, Dialog],
    templateUrl: './add-bookshelf.html',
    styleUrl: './add-bookshelf.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBookshelf {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly bookshelfService = inject(BookshelfService);
    private readonly userService = inject(UserService);

    readonly isDialogOpen: InputSignal<boolean> = input<boolean>(false);
    readonly requestClose: OutputEmitterRef<void> = output<void>();

    readonly dialogTitle = 'Add Bookshelf';

    readonly bookshelfForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
        image: ['', [Validators.required, Validators.minLength(1)]],
    });

    private readonly nameControl = this.bookshelfForm.controls.name;
    private readonly imageControl = this.bookshelfForm.controls.image;

    nameHasError(): boolean {
        return this.nameControl.invalid && (this.nameControl.touched || this.nameControl.dirty);
    }

    imageHasError(): boolean {
        return this.imageControl.invalid && (this.imageControl.touched || this.imageControl.dirty);
    }

    closeDialog(): void {
        this.requestClose.emit();
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

        const userId = this.userService.user()?.id ?? 1;
        this.bookshelfService.addBookshelf(name, image, userId);
        this.closeDialog();
    }
}
