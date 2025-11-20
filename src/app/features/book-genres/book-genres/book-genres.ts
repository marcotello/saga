import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookGenreService } from '../services/book-genre-service';
import { Genre } from '../models/book-genre-model';
import { AddGenre } from '../add-genre/add-genre';
import { UpdateGenre } from '../update-genre/update-genre';
import { DeleteRecord } from '../../../shared/delete-record/delete-record';

@Component({
  selector: 'app-book-genres',
  imports: [CommonModule, AddGenre, UpdateGenre, DeleteRecord],
  templateUrl: './book-genres.html',
  styleUrl: './book-genres.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookGenres {
  private readonly bookGenreService = inject(BookGenreService);

  protected readonly isAddGenreDialogOpen = signal(false);
  protected readonly isUpdateGenreDialogOpen = signal(false);
  protected readonly isDeleteGenreDialogOpen = signal(false);
  protected readonly selectedGenre = signal<Genre | null>(null);
  protected readonly genreToDelete = signal<Genre | null>(null);

  readonly filterText = signal<string>('');

  readonly genres = this.bookGenreService.genres;

  readonly filteredAndSortedGenres = computed(() => {
    const filter = this.filterText().toLowerCase();
    const allGenres = this.genres();

    const nonDeletedGenres = allGenres.filter(genre => !genre.deleted);

    const filtered = filter
      ? nonDeletedGenres.filter(genre => genre.name.toLowerCase().includes(filter))
      : nonDeletedGenres;

    const sorted = [...filtered];
    sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  });

  constructor() {
    this.bookGenreService.getAllGenres();
  }

  onFilterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const filteredValue = Array.from(value)
      .filter(char => /[a-zA-Z\s]/.test(char))
      .join('');

    this.filterText.set(filteredValue);

    if (input.value !== filteredValue) {
      input.value = filteredValue;
    }
  }

  openAddGenreDialog(): void {
    this.isAddGenreDialogOpen.set(true);
  }

  onAddGenreDialogRequestClose(): void {
    this.isAddGenreDialogOpen.set(false);
  }

  onUpdateGenre(genre: Genre): void {
    this.selectedGenre.set(genre);
    this.isUpdateGenreDialogOpen.set(true);
  }

  onUpdateGenreDialogRequestClose(): void {
    this.isUpdateGenreDialogOpen.set(false);
    this.selectedGenre.set(null);
  }

  onDeleteGenre(genre: Genre): void {
    this.genreToDelete.set(genre);
    this.isDeleteGenreDialogOpen.set(true);
  }

  onDeleteGenreDialogClosed(): void {
    this.isDeleteGenreDialogOpen.set(false);
    this.genreToDelete.set(null);
  }

  onDeleteGenreConfirmed(): void {
    const genre = this.genreToDelete();
    if (genre) {
      this.bookGenreService.deleteGenreById(genre.id);
    }
    this.onDeleteGenreDialogClosed();
  }

  onDeleteGenreCanceled(): void {
    this.onDeleteGenreDialogClosed();
  }
}
