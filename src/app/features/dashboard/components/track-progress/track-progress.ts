import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserBook } from '../../../../core/models/user-book';

@Component({
  selector: 'app-track-progress',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './track-progress.html',
  styleUrl: './track-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackProgress {
  books = input<UserBook[] | null>([]);

  updateProgress = output<UserBook>();
  addBook = output<void>();
}

