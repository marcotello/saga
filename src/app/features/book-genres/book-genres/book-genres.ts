import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookGenreService } from '../services/book-genre-service';
import { Genre } from '../models/book-genre-model';
import { AddGenre } from '../add-genre/add-genre';
import { UpdateGenre } from '../update-genre/update-genre';

@Component({
  selector: 'app-book-genres',
  imports: [CommonModule, AddGenre, UpdateGenre],
  templateUrl: './book-genres.html',
  styleUrl: './book-genres.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookGenres {
  private readonly bookGenreService = inject(BookGenreService);

  protected readonly isAddGenreDialogOpen = signal(false);
  protected readonly isUpdateGenreDialogOpen = signal(false);
  protected readonly selectedGenre = signal<Genre | null>(null);

  readonly filterText = signal<string>('');

  readonly genres = this.bookGenreService.genres;

  readonly filteredAndSortedGenres = computed(() => {
    const filter = this.filterText().toLowerCase();
    const allGenres = this.genres();

    // Filter genres based on search text
    const filtered = filter
      ? allGenres.filter(genre => genre.name.toLowerCase().includes(filter))
      : allGenres;

    // Create a new array and sort - keep original object references for proper tracking
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

    // Update the signal - signals automatically trigger change detection
    this.filterText.set(filteredValue);

    // Update the input value to reflect the filtered value if it changed
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
    // Placeholder - won't do anything at this moment
  }
}
