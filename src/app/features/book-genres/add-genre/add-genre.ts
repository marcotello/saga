import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookGenreService } from '../services/book-genre-service';
import { Dialog } from '../../../shared/dialog/dialog';

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

  readonly isDialogOpen: InputSignal<boolean> = input<boolean>(false);
  readonly requestClose: OutputEmitterRef<void> = output<void>();


  readonly dialogTitle = 'Add Genre';

  readonly genreForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  private readonly nameControl = this.genreForm.controls.name;

  readonly nameHasError: Signal<boolean> = computed(() => this.nameControl.invalid && (this.nameControl.touched || this.nameControl.dirty));

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

    if (!name) {
      this.nameControl.setErrors({ required: true });
      return;
    }

    this.bookGenreService.addGenre(name);
    this.closeDialog();
  }
}

