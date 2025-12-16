import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserBook } from '../../../core/models/user-book';

interface BookStatus {
  label: string;
  value: string;
  count: number;
}

@Component({
  selector: 'app-my-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBooks {
  // Status filters with counts
  statuses: BookStatus[] = [
    { label: 'All', value: 'all', count: 142 },
    { label: 'Want to Read', value: 'Want to Read', count: 42 },
    { label: 'Reading', value: 'Reading', count: 3 },
    { label: 'Finished', value: 'Finished', count: 16 },
    { label: 'Save It For Later', value: 'Save It For Later', count: 81 },
  ];

  // Selected status
  selectedStatus = signal<string>('all');

  // Search query
  searchQuery = signal<string>('');

  // Sort configuration
  sortColumn = signal<string>('dateAdded');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Mock books data for display purposes
  books: UserBook[] = [
    {
      id: 1,
      name: 'The Martian',
      author: 'Andy Weir',
      coverImage: '/images/books/pro-angular.jpg',
      progressPercentage: 100,
      createdAt: '2023-09-01',
      updatedAt: '2023-10-12',
      userId: 1,
      genreId: 1,
      status: 'Finished',
      shelves: [1, 2]
    },
    {
      id: 2,
      name: 'Project Hail Mary',
      author: 'Andy Weir',
      coverImage: '/images/books/angular-cookbook.jpg',
      progressPercentage: 45,
      createdAt: '2023-08-15',
      updatedAt: '2023-08-15',
      userId: 1,
      genreId: 1,
      status: 'Reading',
      shelves: [1]
    },
    {
      id: 3,
      name: 'Dune',
      author: 'Frank Herbert',
      coverImage: '/images/books/reactive-patterns.jpg',
      progressPercentage: 100,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-10',
      userId: 1,
      genreId: 2,
      status: 'Finished',
      shelves: [2, 3]
    },
    {
      id: 4,
      name: '1984',
      author: 'George Orwell',
      coverImage: '/images/books/learning-angular.jpg',
      progressPercentage: 0,
      createdAt: '2022-12-20',
      updatedAt: '2022-12-20',
      userId: 1,
      genreId: 3,
      status: 'Want to Read',
      shelves: [4]
    },
    {
      id: 5,
      name: 'Foundation',
      author: 'Isaac Asimov',
      coverImage: '/images/books/ng-book.jpg',
      progressPercentage: 67,
      createdAt: '2022-11-10',
      updatedAt: '2023-03-05',
      userId: 1,
      genreId: 1,
      status: 'Save It For Later',
      shelves: [1]
    }
  ];

  // Shelf names map (mock data)
  shelfNames: { [key: number]: { name: string; color: string } } = {
    1: { name: 'Sci-Fi', color: 'blue' },
    2: { name: 'Favorites', color: 'amber' },
    3: { name: 'Classic', color: 'purple' },
    4: { name: 'Dystopian', color: 'red' }
  };

  // Select a status filter
  selectStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  // Update search query
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  // Toggle sort direction for a column
  toggleSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
  }

  // Get shelf badges for a book
  getShelfBadges(shelves: number[]): { name: string; color: string }[] {
    return shelves.map(shelfId => this.shelfNames[shelfId]).filter(Boolean);
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Get status CSS class
  getStatusClass(status: string): string {
    const baseClass = 'status-badge';
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    return `${baseClass} status-${statusClass}`;
  }
}
