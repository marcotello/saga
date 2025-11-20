import { ChangeDetectionStrategy, Component, inject, input, InputSignal, output, OutputEmitterRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookGenreService } from '../services/book-genre-service';
import { Dialog } from '../../../shared/dialog/dialog';
import { Genre } from '../models/book-genre-model';

@Component({
    selector: 'app-update-genre',
    imports: [CommonModule, ReactiveFormsModule, Dialog],
    templateUrl: './update-genre.html',
    styleUrl: './update-genre.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateGenre {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly bookGenreService = inject(BookGenreService);

    readonly isDialogOpen: InputSignal<boolean> = input<boolean>(false);
    readonly genre: InputSignal<Genre | null> = input<Genre | null>(null);
    readonly requestClose: OutputEmitterRef<void> = output<void>();

    readonly dialogTitle = 'Update Genre';

    readonly genreForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
    });

    private readonly nameControl = this.genreForm.controls.name;

    constructor() {
        effect(() => {
            const genre = this.genre();
            if (genre) {
                this.genreForm.patchValue({
                    name: genre.name
                });
            }
        });
    }

    nameHasError(): boolean {
        return this.nameControl.invalid && (this.nameControl.touched || this.nameControl.dirty);
    }

    closeDialog(): void {
        this.requestClose.emit();
        this.genreForm.reset();
    }

    onSave(): void {
        if (this.genreForm.invalid) {
            this.genreForm.markAllAsTouched();
            return;
        }

        const name = this.nameControl.value.trim();
        const genre = this.genre();

        if (!name) {
            this.nameControl.setErrors({ required: true });
            return;
        }

        if (genre) {
            this.bookGenreService.updateGenreById(genre.id, name);
            this.closeDialog();
        }
    }
}
