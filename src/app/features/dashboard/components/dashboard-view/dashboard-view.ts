import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserBook } from '../../../../core/models/user-book';
import { BookRecommendation } from '../../../../core/models/book-recommendation';
import { TrackProgress } from '../track-progress/track-progress';
import { BooksService } from '../../../../core/services/books-service';
import { BookshelfService } from '../../../../core/services/bookshelf-service';
import { UserService } from '../../../../core/services/user-service';
import { UpdateProgress } from '../update-progress/update-progress';
import { MyBookshelves } from '../my-bookshelves/my-bookshelves';
import { BookSuggestions } from '../book-suggestions/book-suggestions';
import { Statistics } from '../statistics/statistics';

@Component({
  selector: 'app-dashboard-view',
  imports: [TrackProgress, UpdateProgress, MyBookshelves, BookSuggestions, Statistics],
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
  protected readonly recommendedBooks = this.userService.recommendedBooks;
  protected readonly statistics = this.userService.userStatistics;

  protected readonly isUpdateProgressOpen = signal<boolean>(false);
  protected readonly selectedBook = signal<UserBook | null>(null);

  constructor() {
    this.booksService.getBooksByStatusUserId(this.userId, 'Reading');
    this.bookshelfService.getBookshelvesByUserId(this.userId);
    this.booksService.getBookRecommendationsByUserId(this.userId);
    this.userService.getStatisticsByUserId(this.userId);
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

  onBookSuggestionClick(book: BookRecommendation): void {
    // Navigation logic will be added later (book details component not created yet)
    console.log('Book suggestion clicked:', book.name);
  }
}
