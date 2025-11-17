import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
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
export class BookGenres implements OnInit {
  private readonly bookGenreService = inject(BookGenreService);

  readonly filterText = signal<string>('');
  
  readonly genres = this.bookGenreService.genres;
  
  readonly filteredAndSortedGenres = computed(() => {
    const filter = this.filterText().toLowerCase();
    const filtered = this.genres()
      .filter(genre => !genre.deleted)
      .filter(genre => genre.name.toLowerCase().includes(filter));
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  });

  ngOnInit(): void {
    this.bookGenreService.getAllGenres();
  }

  onFilterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Only allow a-z and A-Z characters
    const filteredValue = Array.from(value)
      .filter(char => /[a-zA-Z\s]/.test(char))
      .join('');
    this.filterText.set(filteredValue);
    // Update the input value to reflect the filtered value
    input.value = filteredValue;
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
