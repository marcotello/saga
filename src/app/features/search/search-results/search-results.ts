import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { BookStatusDirective } from '../../../core/directives/book-status.directive';

interface SearchResultBook {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
  coverImage: string;
  status: string;
  shelves: { name: string; color: string }[];
  inLibrary: boolean;
}

@Component({
  selector: 'app-search-results',
  imports: [BookStatusDirective],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResults {
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);

  readonly allBooks = signal<SearchResultBook[]>([
    {
      id: 1,
      title: 'The Martian',
      author: 'Andy Weir',
      publishedYear: 2011,
      coverImage: 'https://covers.openlibrary.org/b/id/8701891-M.jpg',
      status: 'Want to Read',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 2,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      publishedYear: 2021,
      coverImage: 'https://covers.openlibrary.org/b/id/10389354-M.jpg',
      status: 'Reading',
      shelves: [],
      inLibrary: true,
    },
    {
      id: 3,
      title: 'Dune',
      author: 'Frank Herbert',
      publishedYear: 1965,
      coverImage: 'https://covers.openlibrary.org/b/id/11153217-M.jpg',
      status: 'Finished',
      shelves: [{ name: 'Classics', color: 'purple' }],
      inLibrary: false,
    },
    {
      id: 4,
      title: '1984',
      author: 'George Orwell',
      publishedYear: 1949,
      coverImage: 'https://covers.openlibrary.org/b/id/12648894-M.jpg',
      status: 'Finished',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 5,
      title: 'Foundation',
      author: 'Isaac Asimov',
      publishedYear: 1951,
      coverImage: 'https://covers.openlibrary.org/b/id/6524554-M.jpg',
      status: 'Want to Read',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 6,
      title: 'Brave New World',
      author: 'Aldous Huxley',
      publishedYear: 1932,
      coverImage: 'https://covers.openlibrary.org/b/id/12645169-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 7,
      title: 'Neuromancer',
      author: 'William Gibson',
      publishedYear: 1984,
      coverImage: 'https://covers.openlibrary.org/b/id/12746288-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 8,
      title: 'Ender\'s Game',
      author: 'Orson Scott Card',
      publishedYear: 1985,
      coverImage: 'https://covers.openlibrary.org/b/id/8572925-M.jpg',
      status: 'Want to Read',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 9,
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      publishedYear: 1953,
      coverImage: 'https://covers.openlibrary.org/b/id/12818862-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 10,
      title: 'The Hitchhiker\'s Guide to the Galaxy',
      author: 'Douglas Adams',
      publishedYear: 1979,
      coverImage: 'https://covers.openlibrary.org/b/id/12686014-M.jpg',
      status: 'Want to Read',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 11,
      title: 'Snow Crash',
      author: 'Neal Stephenson',
      publishedYear: 1992,
      coverImage: 'https://covers.openlibrary.org/b/id/12763375-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 12,
      title: 'The Left Hand of Darkness',
      author: 'Ursula K. Le Guin',
      publishedYear: 1969,
      coverImage: 'https://covers.openlibrary.org/b/id/12750583-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 13,
      title: 'Hyperion',
      author: 'Dan Simmons',
      publishedYear: 1989,
      coverImage: 'https://covers.openlibrary.org/b/id/12648227-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 14,
      title: 'Rendezvous with Rama',
      author: 'Arthur C. Clarke',
      publishedYear: 1973,
      coverImage: 'https://covers.openlibrary.org/b/id/12697648-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 15,
      title: 'Ringworld',
      author: 'Larry Niven',
      publishedYear: 1970,
      coverImage: 'https://covers.openlibrary.org/b/id/451613-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 16,
      title: 'Solaris',
      author: 'Stanisław Lem',
      publishedYear: 1961,
      coverImage: 'https://covers.openlibrary.org/b/id/12697724-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 17,
      title: 'The Forever War',
      author: 'Joe Haldeman',
      publishedYear: 1974,
      coverImage: 'https://covers.openlibrary.org/b/id/12781697-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 18,
      title: 'Contact',
      author: 'Carl Sagan',
      publishedYear: 1985,
      coverImage: 'https://covers.openlibrary.org/b/id/461772-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 19,
      title: 'Do Androids Dream of Electric Sheep?',
      author: 'Philip K. Dick',
      publishedYear: 1968,
      coverImage: 'https://covers.openlibrary.org/b/id/11429735-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 20,
      title: 'Slaughterhouse-Five',
      author: 'Kurt Vonnegut',
      publishedYear: 1969,
      coverImage: 'https://covers.openlibrary.org/b/id/12700487-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 21,
      title: 'The War of the Worlds',
      author: 'H.G. Wells',
      publishedYear: 1898,
      coverImage: 'https://covers.openlibrary.org/b/id/12648134-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 22,
      title: '2001: A Space Odyssey',
      author: 'Arthur C. Clarke',
      publishedYear: 1968,
      coverImage: 'https://covers.openlibrary.org/b/id/12648266-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 23,
      title: 'The Expanse: Leviathan Wakes',
      author: 'James S.A. Corey',
      publishedYear: 2011,
      coverImage: 'https://covers.openlibrary.org/b/id/12649025-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
    {
      id: 24,
      title: 'Children of Time',
      author: 'Adrian Tchaikovsky',
      publishedYear: 2015,
      coverImage: 'https://covers.openlibrary.org/b/id/12811795-M.jpg',
      status: '',
      shelves: [],
      inLibrary: false,
    },
  ]);

  private readonly sortedBooks = computed(() => {
    const books = [...this.allBooks()];
    return books.sort((a, b) => a.title.localeCompare(b.title));
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
