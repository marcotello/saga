import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBook } from '../../../core/models/user-book';
import { Bookshelf } from '../../../core/models/bookshelf';
import { BookStatusDirective } from '../../../core/directives/book-status.directive';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-my-bookshelves',
  imports: [CommonModule, BookStatusDirective],

  templateUrl: './my-bookshelves.html',
  styleUrl: './my-bookshelves.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookShelves implements OnInit {
  private readonly bookshelfService = inject(BookshelfService);
  private readonly booksService = inject(BooksService);
  private readonly userService = inject(UserService);

  readonly shelves = computed(() => {
    const shelves = this.userService.userBookshelves();
    return shelves ? [...shelves].sort((a, b) => a.name.localeCompare(b.name)) : [];
  });

  readonly selectedShelf = signal<Bookshelf | null>(null);

  readonly books = this.userService.userBooks;

  constructor() {
    effect(() => {
      const shelves = this.shelves();
      if (shelves.length > 0 && !this.selectedShelf()) {
        this.selectShelf(shelves[0]);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    // Simulating user ID 1
    this.bookshelfService.getBookshelvesByUserId(1);
  }

  selectShelf(shelf: Bookshelf): void {
    this.selectedShelf.set(shelf);
    this.booksService.getBooksByBookshelfId(shelf.id);
  }

  createShelf(): void {
    console.log('Create Shelf functionality to be implemented.');
  }

  removeBookFromShelf(book: UserBook): void {
    console.log(`Remove "${book.name}" from "${this.selectedShelf()?.name}" functionality to be implemented.`);
  }
}
