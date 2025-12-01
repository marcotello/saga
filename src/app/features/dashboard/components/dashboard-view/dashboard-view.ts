import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserBook } from '../../../../core/models/user-book';
import { TrackProgress } from '../track-progress/track-progress';
import { BooksService } from '../../../../core/services/books.service';
import { UserService } from '../../../../core/services/user-service';

@Component({
  selector: 'app-dashboard-view',
  imports: [TrackProgress],
  templateUrl: './dashboard-view.html',
  styleUrl: './dashboard-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardView {
  private readonly booksService = inject(BooksService);
  private readonly userService = inject(UserService);

  readonly books = this.userService.currentlyReadingUserBooks;

  constructor() {
    this.booksService.getBooksByUserId(1);
  }

  onUpdateProgress(book: UserBook): void {
    // Logic will be added later
    console.log('Update progress for:', book);
  }

  onAddBook(): void {
    // Logic will be added later
    console.log('Add book clicked');
  }
}
