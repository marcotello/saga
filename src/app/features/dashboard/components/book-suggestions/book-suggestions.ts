import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BookRecommendation } from '../../../../core/models/book-recommendation';

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
  bookSuggestions = input.required<BookRecommendation[] | null>();

  bookClicked = output<BookRecommendation>();

  onBookClick(book: BookRecommendation): void {
    this.bookClicked.emit(book);
  }
}
