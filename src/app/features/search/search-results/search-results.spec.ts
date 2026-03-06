import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';
import { SearchResults } from './search-results';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';
import { SearchResultBook } from '../../../core/models/search-result-book';
import { User } from '../../../core/models/user';

describe('SearchResults', () => {
  let component: SearchResults;
  let fixture: ComponentFixture<SearchResults>;
  let mockBooksService: jasmine.SpyObj<BooksService>;
  let queryParamsSubject: Subject<Record<string, string>>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    name: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    bio: null,
    role: 'User',
    profilePicture: 'default.jpg'
  };

  const mockSearchResults: SearchResultBook[] = [
    {
      id: 1, name: 'Pro Angular', author: 'Adam Freeman',
      coverImage: 'img1.jpg', description: 'Desc 1',
      status: 'Reading', shelves: [{ id: 1, name: 'Angular' }], inLibrary: true,
    },
    {
      id: 3, name: 'Learning Angular', author: 'Aristeidis Bampakos',
      coverImage: 'img2.jpg', description: 'Desc 2',
      status: '', shelves: [], inLibrary: false,
    },
    {
      id: 4, name: 'Angular Enterprise Architecture', author: 'Tomas Trajan',
      coverImage: 'img3.jpg', description: 'Desc 3',
      status: 'Reading', shelves: [{ id: 7, name: 'Angular' }], inLibrary: true,
    },
    {
      id: 5, name: 'Angular: Up and Running', author: 'Shyam Seshadri',
      coverImage: 'img4.jpg', description: 'Desc 4',
      status: '', shelves: [], inLibrary: false,
    },
    {
      id: 6, name: 'Angular Cookbook', author: 'Muhammad Ahsan Ayaz',
      coverImage: 'img5.jpg', description: 'Desc 5',
      status: '', shelves: [], inLibrary: false,
    },
    {
      id: 7, name: 'Angular Projects', author: 'Aristeidis Bampakos',
      coverImage: 'img6.jpg', description: 'Desc 6',
      status: '', shelves: [], inLibrary: false,
    },
    {
      id: 8, name: 'Angular Masterclass', author: 'Souvik Basu',
      coverImage: 'img7.jpg', description: 'Desc 7',
      status: '', shelves: [], inLibrary: false,
    },
  ];

  const searchBooksResultSignal = signal<SearchResultBook[]>([]);
  const isSearchingSignal = signal(false);
  const userSignal = signal<User | null>(mockUser);

  beforeEach(async () => {
    queryParamsSubject = new Subject<Record<string, string>>();
    searchBooksResultSignal.set([]);
    isSearchingSignal.set(false);
    userSignal.set(mockUser);

    mockBooksService = jasmine.createSpyObj('BooksService', ['searchBooks'], {
      searchBooksResult: searchBooksResultSignal,
      isSearching: isSearchingSignal,
    });

    const mockUserService = jasmine.createSpyObj('UserService', [], {
      user: userSignal,
    });

    await TestBed.configureTestingModule({
      imports: [SearchResults],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: { queryParams: queryParamsSubject.asObservable() } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search trigger from query params', () => {
    it('should call booksService.searchBooks when query param is present', () => {
      queryParamsSubject.next({ q: 'angular' });

      expect(mockBooksService.searchBooks).toHaveBeenCalledWith('angular', 1);
    });

    it('should not call searchBooks when query param is empty', () => {
      queryParamsSubject.next({ q: '' });

      expect(mockBooksService.searchBooks).not.toHaveBeenCalled();
    });

    it('should not call searchBooks when query param is missing', () => {
      queryParamsSubject.next({});

      expect(mockBooksService.searchBooks).not.toHaveBeenCalled();
    });

    it('should use userId 0 when user is not logged in', () => {
      userSignal.set(null);
      queryParamsSubject.next({ q: 'angular' });

      expect(mockBooksService.searchBooks).toHaveBeenCalledWith('angular', 0);
    });

    it('should reset current page to 1 on new search', () => {
      component.goToPage(3);
      queryParamsSubject.next({ q: 'angular' });

      expect(component.currentPage()).toBe(1);
    });
  });

  describe('computed signals with search results', () => {
    beforeEach(() => {
      searchBooksResultSignal.set(mockSearchResults);
    });

    it('should sort books alphabetically by name', () => {
      const books = component.books();
      for (let i = 0; i < books.length - 1; i++) {
        expect(books[i].name.localeCompare(books[i + 1].name)).toBeLessThanOrEqual(0);
      }
    });

    it('should return only itemsPerPage books', () => {
      expect(component.books().length).toBe(5);
    });

    it('should calculate totalPages correctly', () => {
      expect(component.totalPages()).toBe(2);
    });

    it('should calculate paginationInfo correctly for page 1', () => {
      const info = component.paginationInfo();
      expect(info.start).toBe(1);
      expect(info.end).toBe(5);
      expect(info.total).toBe(7);
    });

    it('should return empty books when searchBooksResult is empty', () => {
      searchBooksResultSignal.set([]);
      expect(component.books().length).toBe(0);
    });

    it('should calculate totalPages as 0 for empty results', () => {
      searchBooksResultSignal.set([]);
      expect(component.totalPages()).toBe(0);
    });

    it('should return paginationInfo with 0 start for empty results', () => {
      searchBooksResultSignal.set([]);
      const info = component.paginationInfo();
      expect(info.start).toBe(0);
      expect(info.end).toBe(0);
      expect(info.total).toBe(0);
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      searchBooksResultSignal.set(mockSearchResults);
    });

    it('should start on page 1', () => {
      expect(component.currentPage()).toBe(1);
    });

    it('should navigate to next page', () => {
      component.nextPage();
      expect(component.currentPage()).toBe(2);
    });

    it('should navigate to previous page', () => {
      component.goToPage(2);
      component.previousPage();
      expect(component.currentPage()).toBe(1);
    });

    it('should not go below page 1', () => {
      component.previousPage();
      expect(component.currentPage()).toBe(1);
    });

    it('should not go above total pages', () => {
      component.goToPage(component.totalPages());
      component.nextPage();
      expect(component.currentPage()).toBe(component.totalPages());
    });

    it('should go to specific valid page', () => {
      component.goToPage(2);
      expect(component.currentPage()).toBe(2);
    });

    it('should not go to page 0', () => {
      component.goToPage(0);
      expect(component.currentPage()).toBe(1);
    });

    it('should not go to page beyond total', () => {
      component.goToPage(999);
      expect(component.currentPage()).toBe(1);
    });

    it('should show remaining items on last page', () => {
      component.goToPage(2);
      expect(component.books().length).toBe(2);
    });

    it('should update paginationInfo when page changes', () => {
      component.goToPage(2);
      const info = component.paginationInfo();
      expect(info.start).toBe(6);
      expect(info.end).toBe(7);
      expect(info.total).toBe(7);
    });
  });

  describe('paginationButtons', () => {
    it('should show all pages when total is 7 or less', () => {
      searchBooksResultSignal.set(mockSearchResults);
      const buttons = component.paginationButtons();
      expect(buttons).toEqual([1, 2]);
    });

    it('should return empty array when no results', () => {
      searchBooksResultSignal.set([]);
      expect(component.paginationButtons()).toEqual([]);
    });

    it('should return [1] for single page of results', () => {
      searchBooksResultSignal.set(mockSearchResults.slice(0, 3));
      expect(component.paginationButtons()).toEqual([1]);
    });
  });

  describe('loading state', () => {
    it('should expose isSearching from booksService', () => {
      isSearchingSignal.set(true);
      expect(component.booksService.isSearching()).toBe(true);

      isSearchingSignal.set(false);
      expect(component.booksService.isSearching()).toBe(false);
    });
  });

  describe('template rendering', () => {
    it('should show empty state message when no results and not searching', () => {
      searchBooksResultSignal.set([]);
      isSearchingSignal.set(false);
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No results found');
    });

    it('should render table rows for each book on the current page', () => {
      searchBooksResultSignal.set(mockSearchResults);
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(5);
    });

    it('should display book name in the title cell', () => {
      searchBooksResultSignal.set(mockSearchResults.slice(0, 1));
      fixture.detectChanges();

      const titleCell = fixture.nativeElement.querySelector('.book-title');
      expect(titleCell.textContent).toContain('Pro Angular');
    });

    it('should display book author', () => {
      searchBooksResultSignal.set(mockSearchResults.slice(0, 1));
      fixture.detectChanges();

      const authorCell = fixture.nativeElement.querySelector('.author-cell');
      expect(authorCell.textContent).toContain('Adam Freeman');
    });

    it('should show "In Library" button for books in library', () => {
      searchBooksResultSignal.set(mockSearchResults.slice(0, 1));
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn-in-library');
      expect(btn).toBeTruthy();
      expect(btn.textContent).toContain('In Library');
    });

    it('should show "Add to Shelf" button for books not in library', () => {
      const notInLibrary = mockSearchResults.filter(b => !b.inLibrary);
      searchBooksResultSignal.set(notInLibrary.slice(0, 1));
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn-add-to-shelf');
      expect(btn).toBeTruthy();
      expect(btn.textContent).toContain('Add to Shelf');
    });

    it('should render shelf badges for books with shelves', () => {
      searchBooksResultSignal.set(mockSearchResults.slice(0, 1));
      fixture.detectChanges();

      const shelfBadge = fixture.nativeElement.querySelector('.shelf-badge');
      expect(shelfBadge).toBeTruthy();
      expect(shelfBadge.textContent).toContain('Angular');
    });

    it('should not render pagination when there are no results', () => {
      searchBooksResultSignal.set([]);
      fixture.detectChanges();

      const pagination = fixture.nativeElement.querySelector('.pagination');
      expect(pagination).toBeNull();
    });

    it('should render pagination when there are results', () => {
      searchBooksResultSignal.set(mockSearchResults);
      fixture.detectChanges();

      const pagination = fixture.nativeElement.querySelector('.pagination');
      expect(pagination).toBeTruthy();
    });

    it('should display correct pagination info text', () => {
      searchBooksResultSignal.set(mockSearchResults);
      fixture.detectChanges();

      const paginationInfo = fixture.nativeElement.querySelector('.pagination-info');
      expect(paginationInfo.textContent).toContain('Showing 1 to 5 of 7 results');
    });
  });
});
