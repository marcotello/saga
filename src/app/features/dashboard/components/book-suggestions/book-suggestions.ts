import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface BookSuggestion {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-book-suggestions',
  templateUrl: './book-suggestions.html',
  styleUrl: './book-suggestions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSuggestions {
  bookSuggestions = input.required<BookSuggestion[]>();

  bookClicked = output<BookSuggestion>();

  onBookClick(book: BookSuggestion): void {
    this.bookClicked.emit(book);
  }
}
