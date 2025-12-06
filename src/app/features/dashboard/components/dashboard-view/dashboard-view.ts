import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserBook } from '../../../../core/models/user-book';
import { TrackProgress } from '../track-progress/track-progress';
import { BooksService } from '../../../../core/services/books-service';
import { BookshelfService } from '../../../../core/services/bookshelf-service';
import { UserService } from '../../../../core/services/user-service';
import { UpdateProgress } from '../update-progress/update-progress';
import { MyBookshelves } from '../my-bookshelves/my-bookshelves';
import { BookSuggestions, BookSuggestion } from '../book-suggestions/book-suggestions';

@Component({
  selector: 'app-dashboard-view',
  imports: [TrackProgress, UpdateProgress, MyBookshelves, BookSuggestions],
  templateUrl: './dashboard-view.html',
  styleUrl: './dashboard-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardView {
  private readonly booksService = inject(BooksService);
  private readonly bookshelfService = inject(BookshelfService);
  private readonly userService = inject(UserService);

  private readonly userId = this.userService.user()?.id ?? 1;

  protected readonly books = this.userService.currentlyReadingUserBooks;
  protected readonly bookshelves = this.userService.userBookshelves;

  protected readonly isUpdateProgressOpen = signal<boolean>(false);
  protected readonly selectedBook = signal<UserBook | null>(null);

  protected readonly bookSuggestions = signal<BookSuggestion[]>([
    { id: 1, name: 'Mastering Angular Signals', image: 'images/books/ng-book.jpg' },
    { id: 2, name: 'Ai Powered App Development', image: 'images/books/ng-book.jpg' },
    { id: 3, name: 'The ultimate Guide to Angular Evolution', image: 'images/books/ultimate-guide.png' },
    { id: 4, name: 'Effective TypeScript', image: 'images/books/ng-book.jpg' },
    { id: 5, name: 'Angular for Enterprise Applications', image: 'images/books/ng-book.jpg' },
    { id: 6, name: 'Modern Angular', image: 'images/books/ng-book.jpg' }
  ]);

  constructor() {
    this.booksService.getBooksByUserId(this.userId);
    this.bookshelfService.getBookshelvesUserId(this.userId);
  }

  onUpdateProgress(book: UserBook): void {
    this.selectedBook.set(book);
    this.isUpdateProgressOpen.set(true);
  }

  onSaveProgress(progress: number): void {
    const book = this.selectedBook();
    if (book) {
      this.booksService.updateProgress(book, progress);
    }
    this.closeUpdateProgress();
  }

  onCancelProgress(): void {
    this.closeUpdateProgress();
  }

  private closeUpdateProgress(): void {
    this.isUpdateProgressOpen.set(false);
    this.selectedBook.set(null);
  }

  onAddBook(): void {
    // Logic will be added later
    console.log('Add book clicked');
  }

  onShelfClick(): void {
    // Navigation logic will be added later (do nothing for now)
  }

  onAddShelf(): void {
    // Add shelf logic will be added later
    console.log('Add shelf clicked');
  }

  onBookSuggestionClick(book: BookSuggestion): void {
    // Navigation logic will be added later (book details component not created yet)
    console.log('Book suggestion clicked:', book.name);
  }
}
