import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Bookshelf } from '../../../../core/models/bookshelf';

@Component({
  selector: 'app-my-shelves',
  templateUrl: './my-bookshelves.html',
  styleUrl: './my-bookshelves.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookshelves {
  shelves = input.required<Bookshelf[] | null>();

  shelfClicked = output<Bookshelf>();
  addShelfClicked = output<void>();

  onShelfClick(shelf: Bookshelf): void {
    this.shelfClicked.emit(shelf);
  }

  onAddShelfClick(): void {
    this.addShelfClicked.emit();
  }
}

