import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Bookshelf } from '../../../../core/models/bookshelf';

@Component({
  selector: 'app-my-shelves',
  templateUrl: './my-bookshelves.html',
  styleUrl: './my-bookshelves.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookshelves {
  bookshelves = input.required<Bookshelf[] | null>();

  bookshelfClicked = output<Bookshelf>();
  addBookshelfClicked = output<void>();

  onShelfClick(shelf: Bookshelf): void {
    this.bookshelfClicked.emit(shelf);
  }

  onAddShelfClick(): void {
    this.addBookshelfClicked.emit();
  }
}

