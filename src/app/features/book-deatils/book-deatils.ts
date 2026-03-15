import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BooksService } from '../../core/services/books-service';
import { UserService } from '../../core/services/user-service';
import { WithLoadingState } from '../../core/directives/with-loading-state';
import { DatePipe } from '@angular/common';
import { SearchResultBook } from '../../core/models/search-result-book';

@Component({
  selector: 'app-book-deatils',
  imports: [WithLoadingState, DatePipe],
  templateUrl: './book-deatils.html',
  styleUrl: './book-deatils.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDeatils {
  private readonly userService = inject(UserService);
  readonly booksService = inject(BooksService);

  readonly id = input.required<string>();

  readonly book = this.booksService.bookDetail;
  readonly isLoading = this.booksService.isLoadingBookDetail;
  readonly notFound = this.booksService.bookDetailNotFound;

  readonly bookshelves = computed(() => this.userService.userBookshelves() ?? []);

  readonly currentPage = computed(() => {
    const detail = this.book();
    if (!detail || detail.pages === 0) return 0;
    return Math.round((detail.progressPercentage / 100) * detail.pages);
  });

  readonly dateReadDisplay = computed(() => {
    const detail = this.book();
    if (!detail?.inLibrary) return '';
    if (detail.status === 'Reading') return 'In Progress';
    if (detail.status === 'Finished') return detail.updatedAt;
    return '';
  });

  constructor() {
    effect(() => {
      const bookId = Number(this.id());
      const userId = this.userService.user()?.id ?? 0;
      if (bookId) {
        this.booksService.getBookDetails(bookId, userId);
      }
    });
  }

  onShelfChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (!value) return;

    const shelfId = +value;
    const currentBook = this.book();
    if (!currentBook) return;

    const shelf = this.bookshelves().find(s => s.id === shelfId);
    if (!shelf) return;

    const searchResultBook: SearchResultBook = {
      id: currentBook.id,
      name: currentBook.name,
      author: currentBook.author,
      coverImage: currentBook.coverImage,
      description: currentBook.description,
      status: currentBook.status,
      shelves: currentBook.shelves,
      inLibrary: currentBook.inLibrary,
    };

    const userId = this.userService.user()?.id ?? 0;
    this.booksService.addBookToShelf(searchResultBook, shelf.id, shelf.name, userId);
  }
}
