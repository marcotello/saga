import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserBook } from '../../../../core/models/user-book';
import { TrackProgress } from '../track-progress/track-progress';
import { BooksService } from '../../../../core/services/books.service';
import { UserService } from '../../../../core/services/user-service';
import { UpdateProgress } from '../update-progress/update-progress';

@Component({
  selector: 'app-dashboard-view',
  imports: [TrackProgress, UpdateProgress],
  templateUrl: './dashboard-view.html',
  styleUrl: './dashboard-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardView {
  private readonly booksService = inject(BooksService);
  private readonly userService = inject(UserService);

  private readonly userId = this.userService.user()?.id ?? 1;

  protected readonly books = this.userService.currentlyReadingUserBooks;

  protected readonly isUpdateProgressOpen = signal<boolean>(false);
  protected readonly selectedBook = signal<UserBook | null>(null);

  constructor() {
    this.booksService.getBooksByUserId(this.userId);
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
}
