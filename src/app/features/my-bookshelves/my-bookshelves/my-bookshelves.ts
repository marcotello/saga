import { ChangeDetectionStrategy, Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBook } from '../../../core/models/user-book';
import { Bookshelf } from '../../../core/models/bookshelf';
import { BookStatusDirective } from '../../../core/directives/book-status.directive';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';
import { AddBook } from '../add-book/add-book';

@Component({
  selector: 'app-my-bookshelves',
  imports: [CommonModule, BookStatusDirective, AddBook],

  templateUrl: './my-bookshelves.html',
  styleUrl: './my-bookshelves.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookShelves {
  private readonly bookshelfService = inject(BookshelfService);
  private readonly booksService = inject(BooksService);
  private readonly userService = inject(UserService);

  readonly user = this.userService.user;

  readonly shelves = computed(() => {
    const shelves = this.userService.userBookshelves();
    return shelves ? [...shelves].sort((a, b) => a.name.localeCompare(b.name)) : [];
  });

  readonly selectedShelf = signal<Bookshelf | null>(null);
  protected readonly isAddBookDialogOpen = signal(false);

  readonly bookPluralMapping: { [k: string]: string } = {
    '=0': 'No books',
    '=1': '1 book',
    'other': '# books',
  };

  readonly books = this.userService.userBooks;

  constructor() {
    effect(() => {
      const shelves = this.shelves();
      if (shelves.length > 0 && !this.selectedShelf()) {
        this.selectShelf(shelves[0]);
      }
    }, { allowSignalWrites: true });

    this.bookshelfService.getBookshelvesByUserId(this.user()?.id ?? 1);
  }
  selectShelf(shelf: Bookshelf): void {
    this.selectedShelf.set(shelf);
    this.booksService.getBooksByBookshelfId(shelf.id, this.user()?.id ?? 1);
  }

  createShelf(): void {
    this.isAddBookDialogOpen.set(true);
  }

  onAddBookDialogRequestClose(): void {
    this.isAddBookDialogOpen.set(false);
  }

  removeBookFromShelf(book: UserBook): void {
    const shelfId = this.selectedShelf()?.id;
    if (shelfId) {
      this.bookshelfService.removeBookFromShelf(shelfId, book.id);
    }
  }
}
