import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BookProgress } from '../../models/track-progress-model';
import { TrackProgress } from '../track-progress/track-progress';

@Component({
  selector: 'app-dashboard-view',
  imports: [TrackProgress],
  templateUrl: './dashboard-view.html',
  styleUrl: './dashboard-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardView {
  // Mock data for design purposes - will be replaced with actual data later
  readonly books = signal<BookProgress[]>([
    {
      id: 1,
      title: 'The Great Gatsby',
      coverImage: 'https://via.placeholder.com/150x225?text=Book+Cover',
      progressPercentage: 45
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      coverImage: 'https://via.placeholder.com/150x225?text=Book+Cover',
      progressPercentage: 78
    }
  ]);

  onUpdateProgress(book: BookProgress): void {
    // Logic will be added later
    console.log('Update progress for:', book);
  }

  onAddBook(): void {
    // Logic will be added later
    console.log('Add book clicked');
  }
}
