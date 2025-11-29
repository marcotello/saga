import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BookProgress } from '../models/track-progress-model';

@Component({
  selector: 'app-track-progress',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './track-progress.html',
  styleUrl: './track-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackProgress {
  books = input<BookProgress[]>([]);
  
  updateProgress = output<BookProgress>();
  addBook = output<void>();
}

