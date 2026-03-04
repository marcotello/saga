import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookStatusDirective } from '../../../core/directives/book-status.directive';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';
import { WithLoadingState } from '../../../core/directives/with-loading-state';

@Component({
  selector: 'app-search-results',
  imports: [BookStatusDirective, WithLoadingState],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResults {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  readonly booksService = inject(BooksService);

  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);

  private readonly sortedBooks = computed(() => {
    const books = [...this.booksService.searchBooksResult()];
    return books.sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.sortedBooks().length / this.itemsPerPage())
  );

  readonly books = computed(() => {
    const sorted = this.sortedBooks();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  });

  readonly paginationInfo = computed(() => {
    const total = this.sortedBooks().length;
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = total === 0 ? 0 : (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    return { start, end, total };
  });

  readonly paginationButtons = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const buttons: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      if (current > 3) buttons.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }
      if (current < total - 2) buttons.push('...');
      buttons.push(total);
    }

    return buttons;
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      const query = params['q'] ?? '';
      const userId = this.userService.user()?.id ?? 0;
      if (query) {
        this.currentPage.set(1);
        this.booksService.searchBooks(query, userId);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
}
