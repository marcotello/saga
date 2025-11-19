import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookGenreService } from './book-genre-service';
import { Dialog } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-add-genre',
  imports: [CommonModule, ReactiveFormsModule, Dialog],
  templateUrl: './add-genre.html',
  styleUrl: './add-genre.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGenre {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly bookGenreService = inject(BookGenreService);

  private readonly _isDialogOpen = signal(false);
  readonly isDialogOpen = this._isDialogOpen.asReadonly();

  readonly dialogTitle = 'Add Genre';

  readonly genreForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  private readonly nameControl = this.genreForm.controls.name;

  readonly nameHasError: Signal<boolean> = computed(() => this.nameControl.invalid && (this.nameControl.touched || this.nameControl.dirty));

  openDialog(): void {
    this._isDialogOpen.set(true);
  }

  closeDialog(): void {
    this._isDialogOpen.set(false);
    this.genreForm.reset();
  }

  onSave(): void {
    if (this.genreForm.invalid) {
      this.genreForm.markAllAsTouched();
      return;
    }

    const name = this.nameControl.value.trim();

    if (!name) {
      this.nameControl.setErrors({ required: true });
      return;
    }

    this.bookGenreService.addGenre(name);
    this.closeDialog();
  }
}

