import { ChangeDetectionStrategy, Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBook } from '../../../core/models/user-book';
import { Bookshelf } from '../../../core/models/bookshelf';
import { BookStatusDirective } from '../../../core/directives/book-status.directive';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';
import { AddBookshelf } from "../add-book/add-bookshelf";
import { UpdateBookshelf } from "../update-bookshelf/update-bookshelf";
import { DeleteRecord } from "../../../shared/delete-record/delete-record";

@Component({
  selector: 'app-my-bookshelves',
  imports: [CommonModule, BookStatusDirective, AddBookshelf, UpdateBookshelf, DeleteRecord],

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
  protected readonly isUpdateBookshelfDialogOpen = signal(false);
  protected readonly isDeleteBookshelfDialogOpen = signal(false);
  protected readonly isRemoveBookDialogOpen = signal(false);
  private readonly bookToRemove = signal<UserBook | null>(null);

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

  updateShelf(): void {
    this.isUpdateBookshelfDialogOpen.set(true);
  }

  onUpdateBookshelfDialogRequestClose(updatedShelf: Bookshelf | null): void {
    this.isUpdateBookshelfDialogOpen.set(false);
    if (updatedShelf) {
      this.selectedShelf.set(updatedShelf);
    }
  }

  deleteShelf(): void {
    this.isDeleteBookshelfDialogOpen.set(true);
  }

  onDeleteBookshelfConfirmed(): void {
    const shelf = this.selectedShelf();
    if (shelf) {
      this.bookshelfService.deleteBookshelf(shelf.id);
      const remaining = this.shelves().filter(s => s.id !== shelf.id);
      this.selectedShelf.set(remaining.length > 0 ? remaining[0] : null);
    }
    this.onDeleteBookshelfDialogClosed();
  }

  onDeleteBookshelfCanceled(): void {
    this.onDeleteBookshelfDialogClosed();
  }

  onDeleteBookshelfDialogClosed(): void {
    this.isDeleteBookshelfDialogOpen.set(false);
  }

  removeBookFromShelf(book: UserBook): void {
    this.bookToRemove.set(book);
    this.isRemoveBookDialogOpen.set(true);
  }

  onRemoveBookConfirmed(): void {
    const book = this.bookToRemove();
    const shelfId = this.selectedShelf()?.id;
    if (book && shelfId) {
      this.bookshelfService.removeBookFromShelf(shelfId, book.id);
    }
    this.onRemoveBookDialogClosed();
  }

  onRemoveBookCanceled(): void {
    this.onRemoveBookDialogClosed();
  }

  onRemoveBookDialogClosed(): void {
    this.isRemoveBookDialogOpen.set(false);
    this.bookToRemove.set(null);
  }
}
