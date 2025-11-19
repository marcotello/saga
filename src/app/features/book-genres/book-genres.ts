import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookGenreService } from './book-genre-service';
import { Genre } from './book-genre-model';

@Component({
  selector: 'app-book-genres',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-genres.html',
  styleUrl: './book-genres.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookGenres {
  private readonly bookGenreService = inject(BookGenreService);

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

  onAddGenre(): void {
    // Placeholder - won't do anything at this moment
  }

  onUpdateGenre(genre: Genre): void {
    // Placeholder - won't do anything at this moment
  }

  onDeleteGenre(genre: Genre): void {
    // Placeholder - won't do anything at this moment
  }
}
