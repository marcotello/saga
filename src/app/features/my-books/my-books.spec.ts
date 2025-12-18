import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { MyBooks } from './my-books';
import { BooksService } from '../../core/services/books-service';
import { UserService } from '../../core/services/user-service';
import { UserBook } from '../../core/models/user-book';
import { ReadingStatus } from '../../core/models/reading-status';
import { User } from '../../core/models/user';

describe('MyBooks', () => {
  let component: MyBooks;
  let fixture: ComponentFixture<MyBooks>;
  let booksService: jasmine.SpyObj<BooksService>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    name: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    bio: 'Test bio',
    role: 'user',
    profilePicture: 'test.jpg'
  };

  const mockBooks: UserBook[] = [
    {
      id: 1,
      userId: 1,
      name: 'Angular Pro',
      author: 'John Doe',
      coverImage: 'test1.jpg',
      status: 'Reading',
      progressPercentage: 50,
      genreId: 1,
      shelves: [1, 2],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      userId: 1,
      name: 'TypeScript Mastery',
      author: 'Jane Smith',
      coverImage: 'test2.jpg',
      status: 'Finished',
      progressPercentage: 100,
      genreId: 2,
      shelves: [1],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-20'
    },
    {
      id: 3,
      userId: 1,
      name: 'RxJS Deep Dive',
      author: 'Bob Johnson',
      coverImage: 'test3.jpg',
      status: 'Want to Read',
      progressPercentage: 0,
      genreId: 1,
      shelves: [3],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    }
  ];

  const mockStatuses: ReadingStatus[] = [
    { status: 'Reading' },
    { status: 'Finished' },
    { status: 'Want to Read' }
  ];

  beforeEach(async () => {
    const booksServiceSpy = jasmine.createSpyObj('BooksService', [
      'getReadingStatuses',
      'getBooksByUserId'
    ], {
      readingStatuses: signal(mockStatuses)
    });

    const userServiceSpy = jasmine.createSpyObj('UserService', [], {
      user: signal(mockUser),
      userBooks: signal(mockBooks)
    });

    await TestBed.configureTestingModule({
      imports: [MyBooks],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBooks);
    component = fixture.componentInstance;
    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Constructor initialization', () => {
    it('should call getReadingStatuses on initialization', () => {
      expect(booksService.getReadingStatuses).toHaveBeenCalled();
    });

    it('should call getBooksByUserId with user ID on initialization', () => {
      expect(booksService.getBooksByUserId).toHaveBeenCalledWith(1);
    });

    it('should use default userId 1 when user is null', () => {
      const userServiceWithNullUser = jasmine.createSpyObj('UserService', [], {
        user: signal(null),
        userBooks: signal([])
      });

      const booksServiceSpy2 = jasmine.createSpyObj('BooksService', [
        'getReadingStatuses',
        'getBooksByUserId'
      ], {
        readingStatuses: signal([])
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [MyBooks],
        providers: [
          { provide: BooksService, useValue: booksServiceSpy2 },
          { provide: UserService, useValue: userServiceWithNullUser },
          provideNoopAnimations()
        ]
      });

      const newFixture = TestBed.createComponent(MyBooks);
      newFixture.detectChanges();

      expect(booksServiceSpy2.getBooksByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('Signals', () => {
    it('should initialize selectedStatus as "all"', () => {
      expect(component.selectedStatus()).toBe('all');
    });

    it('should initialize searchQuery as empty string', () => {
      expect(component.searchQuery()).toBe('');
    });

    it('should initialize sortColumn as "dateAdded"', () => {
      expect(component.sortColumn()).toBe('dateAdded');
    });

    it('should initialize sortDirection as "desc"', () => {
      expect(component.sortDirection()).toBe('desc');
    });

    it('should initialize currentPage as 1', () => {
      expect(component.currentPage()).toBe(1);
    });

    it('should initialize itemsPerPage as 5', () => {
      expect(component.itemsPerPage()).toBe(5);
    });
  });

  describe('statuses computed signal', () => {
    it('should include "All" status with total count', () => {
      const statuses = component.statuses();
      const allStatus = statuses.find(s => s.value === 'all');

      expect(allStatus).toBeTruthy();
      expect(allStatus?.label).toBe('All');
      expect(allStatus?.count).toBe(mockBooks.length);
    });

    it('should include all reading statuses with counts', () => {
      const statuses = component.statuses();

      expect(statuses.length).toBe(4); // All + 3 statuses
      expect(statuses.find(s => s.value === 'Reading')?.count).toBe(1);
      expect(statuses.find(s => s.value === 'Finished')?.count).toBe(1);
      expect(statuses.find(s => s.value === 'Want to Read')?.count).toBe(1);
    });
  });

  describe('books computed signal', () => {
    it('should return paginated books', () => {
      const books = component.books();
      expect(books.length).toBeLessThanOrEqual(5);
    });

    it('should filter by status when selectedStatus is not "all"', () => {
      component.selectStatus('Reading');
      fixture.detectChanges();

      const books = component.books();
      expect(books.every(book => book.status === 'Reading')).toBe(true);
    });

    it('should filter by search query', () => {
      component.onSearchChange('Angular');
      fixture.detectChanges();

      const books = component.books();
      expect(books.length).toBe(1);
      expect(books[0].name).toBe('Angular Pro');
    });

    it('should filter by author in search query', () => {
      component.onSearchChange('Jane');
      fixture.detectChanges();

      const books = component.books();
      expect(books.length).toBe(1);
      expect(books[0].author).toBe('Jane Smith');
    });

    it('should be case-insensitive in search', () => {
      component.onSearchChange('angular');
      fixture.detectChanges();

      const books = component.books();
      expect(books.length).toBe(1);
    });
  });

  describe('selectStatus', () => {
    it('should update selectedStatus signal', () => {
      component.selectStatus('Reading');
      expect(component.selectedStatus()).toBe('Reading');
    });

    it('should reset to first page', () => {
      component.currentPage.set(3);
      component.selectStatus('Finished');

      expect(component.currentPage()).toBe(1);
    });
  });

  describe('onSearchChange', () => {
    it('should update searchQuery signal', () => {
      component.onSearchChange('test query');
      expect(component.searchQuery()).toBe('test query');
    });

    it('should reset to first page', () => {
      component.currentPage.set(2);
      component.onSearchChange('test');

      expect(component.currentPage()).toBe(1);
    });
  });

  describe('toggleSort', () => {
    it('should toggle sort direction when same column is clicked', () => {
      component.sortColumn.set('title');
      component.sortDirection.set('asc');

      component.toggleSort('title');

      expect(component.sortDirection()).toBe('desc');
    });

    it('should set new column and default to desc when different column is clicked', () => {
      component.sortColumn.set('title');
      component.sortDirection.set('asc');

      component.toggleSort('author');

      expect(component.sortColumn()).toBe('author');
      expect(component.sortDirection()).toBe('desc');
    });

    it('should sort books by title', () => {
      component.toggleSort('title');
      fixture.detectChanges();

      const books = component.books();
      expect(books[0].name).toBe('TypeScript Mastery');
    });

    it('should sort books by author', () => {
      component.sortColumn.set('author');
      component.sortDirection.set('asc');
      fixture.detectChanges();

      const books = component.books();
      expect(books[0].author).toBe('Bob Johnson');
    });

    it('should sort books by status', () => {
      component.sortColumn.set('status');
      component.sortDirection.set('asc');
      fixture.detectChanges();

      const books = component.books();
      expect(books[0].status).toBe('Finished');
    });

    it('should sort books by dateAdded', () => {
      component.sortColumn.set('dateAdded');
      component.sortDirection.set('asc');
      fixture.detectChanges();

      const books = component.books();
      expect(books[0].id).toBe(1);
    });
  });

  describe('Pagination', () => {
    describe('goToPage', () => {
      it('should go to specified page if valid', () => {
        component.itemsPerPage.set(2); // With 3 books, this creates 2 pages
        fixture.detectChanges();
        
        component.goToPage(2);
        expect(component.currentPage()).toBe(2);
      });

      it('should not go to page less than 1', () => {
        component.currentPage.set(2);
        component.goToPage(0);

        expect(component.currentPage()).toBe(2);
      });

      it('should not go to page greater than total pages', () => {
        component.currentPage.set(1);
        component.goToPage(999);

        expect(component.currentPage()).toBe(1);
      });
    });

    describe('previousPage', () => {
      it('should go to previous page if not on first page', () => {
        component.currentPage.set(2);
        component.previousPage();

        expect(component.currentPage()).toBe(1);
      });

      it('should not go below page 1', () => {
        component.currentPage.set(1);
        component.previousPage();

        expect(component.currentPage()).toBe(1);
      });
    });

    describe('nextPage', () => {
      it('should go to next page if not on last page', () => {
        component.currentPage.set(1);
        component.itemsPerPage.set(2); // With 3 books, this creates 2 pages
        fixture.detectChanges();

        component.nextPage();

        expect(component.currentPage()).toBe(2);
      });

      it('should not go beyond total pages', () => {
        component.currentPage.set(1);
        component.itemsPerPage.set(10); // Only 1 page with 3 books
        fixture.detectChanges();

        component.nextPage();

        expect(component.currentPage()).toBe(1);
      });
    });

    describe('totalPages', () => {
      it('should calculate correct number of pages', () => {
        component.itemsPerPage.set(2);
        fixture.detectChanges();

        expect(component.totalPages()).toBe(2);
      });

      it('should handle empty results', () => {
        component.selectStatus('NonExistent');
        fixture.detectChanges();

        expect(component.totalPages()).toBe(0);
      });
    });

    describe('paginationInfo', () => {
      it('should show correct start, end, and total', () => {
        component.itemsPerPage.set(2);
        component.currentPage.set(1);
        fixture.detectChanges();

        const info = component.paginationInfo();
        expect(info.start).toBe(1);
        expect(info.end).toBe(2);
        expect(info.total).toBe(3);
      });

      it('should show correct info on last page', () => {
        component.itemsPerPage.set(2);
        component.currentPage.set(2);
        fixture.detectChanges();

        const info = component.paginationInfo();
        expect(info.start).toBe(3);
        expect(info.end).toBe(3);
        expect(info.total).toBe(3);
      });

      it('should handle empty results', () => {
        component.selectStatus('NonExistent');
        fixture.detectChanges();

        const info = component.paginationInfo();
        expect(info.start).toBe(0);
        expect(info.end).toBe(0);
        expect(info.total).toBe(0);
      });
    });

    describe('paginationButtons', () => {
      it('should show all pages if 7 or less', () => {
        component.itemsPerPage.set(1);
        fixture.detectChanges();

        const buttons = component.paginationButtons();
        expect(buttons).toEqual([1, 2, 3]);
      });

      it('should include ellipsis for more than 7 pages', () => {
        // Create more books to test pagination
        const manyBooks: UserBook[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          userId: 1,
          name: `Book ${i + 1}`,
          author: 'Author',
          coverImage: 'test.jpg',
          status: 'Reading',
          progressPercentage: 0,
          genreId: 1,
          shelves: [1],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }));

        // Create a new userService with many books
        const newUserService = jasmine.createSpyObj('UserService', [], {
          user: signal(mockUser),
          userBooks: signal(manyBooks)
        });

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          imports: [MyBooks],
          providers: [
            { provide: BooksService, useValue: booksService },
            { provide: UserService, useValue: newUserService },
            provideNoopAnimations()
          ]
        });

        const newFixture = TestBed.createComponent(MyBooks);
        const newComponent = newFixture.componentInstance;
        
        newComponent.itemsPerPage.set(2); // 20 books / 2 per page = 10 pages
        newComponent.currentPage.set(5);
        newFixture.detectChanges();

        const buttons = newComponent.paginationButtons();
        expect(buttons).toContain('...');
        // With 10 pages and current page 5, we get: 1, '...', 4, 5, 6, '...', 10 = 7 items
        expect(buttons.length).toBe(7);
      });
    });
  });

  describe('getShelfBadges', () => {
    it('should return shelf badges for given shelf IDs', () => {
      const badges = component.getShelfBadges([1, 2]);

      expect(badges.length).toBe(2);
      expect(badges[0].name).toBe('Sci-Fi');
      expect(badges[0].color).toBe('blue');
      expect(badges[1].name).toBe('Favorites');
      expect(badges[1].color).toBe('amber');
    });

    it('should filter out invalid shelf IDs', () => {
      const badges = component.getShelfBadges([1, 999]);

      expect(badges.length).toBe(1);
      expect(badges[0].name).toBe('Sci-Fi');
    });

    it('should return empty array for empty input', () => {
      const badges = component.getShelfBadges([]);
      expect(badges).toEqual([]);
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const formatted = component.formatDate('2024-01-15');
      expect(formatted).toMatch(/Jan 1[45], 2024/);
    });

    it('should return em dash for empty string', () => {
      const formatted = component.formatDate('');
      expect(formatted).toBe('—');
    });

    it('should return em dash for null/undefined', () => {
      const formatted = component.formatDate(null as any);
      expect(formatted).toBe('—');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct class for status', () => {
      const className = component.getStatusClass('Reading');
      expect(className).toBe('status-badge status-reading');
    });

    it('should handle multi-word status', () => {
      const className = component.getStatusClass('Want to Read');
      expect(className).toBe('status-badge status-want-to-read');
    });

    it('should convert to lowercase', () => {
      const className = component.getStatusClass('FINISHED');
      expect(className).toBe('status-badge status-finished');
    });
  });
});
