import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserBook } from '../../core/models/user-book';
import { BooksService } from '../../core/services/books-service';
import { UserService } from '../../core/services/user-service';

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
  private readonly booksService = inject(BooksService);
  private readonly userService = inject(UserService);

  // Selected status
  selectedStatus = signal<string>('all');

  // Search query
  searchQuery = signal<string>('');

  // Sort configuration
  sortColumn = signal<string>('dateAdded');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Pagination
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);

  // Shelf names map (mock data)
  shelfNames: { [key: number]: { name: string; color: string } } = {
    1: { name: 'Sci-Fi', color: 'blue' },
    2: { name: 'Favorites', color: 'amber' },
    3: { name: 'Classic', color: 'purple' },
    4: { name: 'Dystopian', color: 'red' }
  };

  constructor() {
    // Load reading statuses
    this.booksService.getReadingStatuses();

    // Load books for the current user (assuming userId 1)
    const userId = this.userService.user()?.id ?? 1;
    this.booksService.getBooksByUserId(userId);
  }

  // Computed signal for all user books from UserService
  private allBooks = computed(() => this.userService.userBooks() ?? []);

  // Computed signal for statuses with counts from BooksService
  statuses = computed<BookStatus[]>(() => {
    const readingStatuses = this.booksService.readingStatuses();
    const books = this.allBooks();

    // Create status array with counts
    const statusList: BookStatus[] = [
      { label: 'All', value: 'all', count: books.length }
    ];

    readingStatuses.forEach(status => {
      const count = books.filter(book => book.status === status.status).length;
      statusList.push({
        label: status.status,
        value: status.status,
        count
      });
    });

    return statusList;
  });

  // Computed signal for filtered books (by status and search)
  private filteredBooks = computed(() => {
    let books = this.allBooks();
    const status = this.selectedStatus();
    const query = this.searchQuery().toLowerCase().trim();

    // Filter by status
    if (status !== 'all') {
      books = books.filter(book => book.status === status);
    }

    // Filter by search query
    if (query) {
      books = books.filter(book =>
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    return books;
  });

  // Computed signal for sorted books
  private sortedBooks = computed(() => {
    const books = [...this.filteredBooks()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    books.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (column) {
        case 'title':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'dateRead':
          aValue = a.status === 'Finished' ? new Date(a.updatedAt).getTime() : 0;
          bValue = b.status === 'Finished' ? new Date(b.updatedAt).getTime() : 0;
          break;
        case 'dateAdded':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return books;
  });

  // Computed signal for total pages
  totalPages = computed(() => {
    const total = this.sortedBooks().length;
    const perPage = this.itemsPerPage();
    return Math.ceil(total / perPage);
  });

  // Computed signal for paginated books
  books = computed(() => {
    const sorted = this.sortedBooks();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return sorted.slice(start, end);
  });

  // Computed signal for pagination info
  paginationInfo = computed(() => {
    const total = this.sortedBooks().length;
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = total === 0 ? 0 : (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    return { start, end, total };
  });

  // Computed signal for pagination buttons
  paginationButtons = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const buttons: (number | string)[] = [];

    if (total <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= total; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);

      if (current > 3) {
        buttons.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }

      if (current < total - 2) {
        buttons.push('...');
      }

      // Always show last page
      buttons.push(total);
    }

    return buttons;
  });

  // Select a status filter
  selectStatus(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1); // Reset to first page when filtering
  }

  // Update search query
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page when searching
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

  // Go to specific page
  goToPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this.currentPage.set(page);
    }
  }

  // Go to previous page
  previousPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.currentPage.set(current - 1);
    }
  }

  // Go to next page
  nextPage(): void {
    const current = this.currentPage();
    const total = this.totalPages();
    if (current < total) {
      this.currentPage.set(current + 1);
    }
  }

  // Get shelf badges for a book
  getShelfBadges(shelves: { id: number; name: string }[]): { name: string; color: string }[] {
    return shelves.map(shelf => ({
      name: shelf.name,
      color: this.shelfNames[shelf.id]?.color || 'gray'
    }));
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
