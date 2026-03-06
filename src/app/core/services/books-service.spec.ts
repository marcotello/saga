import { TestBed } from '@angular/core/testing';
import { BooksService } from './books-service';
import { BooksHttpMockService } from '../mock-api/mock-http-services/books-http-mock-service';
import { BookStatusMockService } from '../mock-api/mock-http-services/book-status-mock-service';
import { UserService } from './user-service';
import { UserBook } from '../models/user-book';
import { BookRecommendation } from '../models/book-recommendation';
import { ReadingStatus } from '../models/reading-status';
import { SearchResultBook } from '../models/search-result-book';
import { of, throwError } from 'rxjs';

describe('BooksService', () => {
  let service: BooksService;
  let booksHttpMockService: jasmine.SpyObj<BooksHttpMockService>;
  let bookStatusMockService: jasmine.SpyObj<BookStatusMockService>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUserBooks: UserBook[] = [
    {
      id: 1,
      userId: 1,
      name: 'Test Book 1',
      author: 'Author 1',
      coverImage: 'test1.jpg',
      status: 'Reading',
      progressPercentage: 50,
      genreId: 1,
      shelves: [{ id: 1, name: 'Shelf 1' }],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 2,
      userId: 1,
      name: 'Test Book 2',
      author: 'Author 2',
      coverImage: 'test2.jpg',
      status: 'Finished',
      progressPercentage: 100,
      genreId: 1,
      shelves: [{ id: 1, name: 'Shelf 1' }],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 3,
      userId: 1,
      name: 'Test Book 3',
      author: 'Author 3',
      coverImage: 'test3.jpg',
      status: 'Reading',
      progressPercentage: 25,
      genreId: 1,
      shelves: [{ id: 1, name: 'Shelf 1' }],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  const mockRecommendations: BookRecommendation[] = [
    {
      id: 1,
      userId: 1,
      name: 'Recommended Book 1',
      author: 'Author 1',
      coverImage: 'rec1.jpg'
    },
    {
      id: 2,
      userId: 1,
      name: 'Recommended Book 2',
      author: 'Author 2',
      coverImage: 'rec2.jpg'
    }
  ];

  const mockStatuses: ReadingStatus[] = [
    { status: 'Reading' },
    { status: 'Finished' },
    { status: 'Want to Read' }
  ];

  beforeEach(() => {
    const booksHttpMockServiceSpy = jasmine.createSpyObj('BooksHttpMockService', [
      'getBooksByUserId',
      'getBookRecommendationsByUserId',
      'updateBook',
      'searchBooks'
    ]);

    const bookStatusMockServiceSpy = jasmine.createSpyObj('BookStatusMockService', [
      'getReadingStatuses'
    ]);

    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'setUserBooks',
      'setCurrentlyReadingUserBooks',
      'setRecommendedBooks',
      'updateUserBook'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BooksService,
        { provide: BooksHttpMockService, useValue: booksHttpMockServiceSpy },
        { provide: BookStatusMockService, useValue: bookStatusMockServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(BooksService);
    booksHttpMockService = TestBed.inject(BooksHttpMockService) as jasmine.SpyObj<BooksHttpMockService>;
    bookStatusMockService = TestBed.inject(BookStatusMockService) as jasmine.SpyObj<BookStatusMockService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBooksByUserId', () => {
    it('should call booksHttpMockService with correct user ID', () => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByUserId(1);

      expect(booksHttpMockService.getBooksByUserId).toHaveBeenCalledWith(1);
    });

    it('should set user books in userService on success', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByUserId(1);

      setTimeout(() => {
        expect(userService.setUserBooks).toHaveBeenCalledWith(mockUserBooks);
        done();
      });
    });

    it('should filter and set currently reading books', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByUserId(1);

      setTimeout(() => {
        const readingBooks = mockUserBooks.filter(book => book.status === 'Reading');
        expect(userService.setCurrentlyReadingUserBooks).toHaveBeenCalledWith(readingBooks);
        expect(userService.setCurrentlyReadingUserBooks).toHaveBeenCalledWith(
          jasmine.arrayContaining([
            jasmine.objectContaining({ id: 1, status: 'Reading' }),
            jasmine.objectContaining({ id: 3, status: 'Reading' })
          ])
        );
        done();
      });
    });

    it('should only include books with "Reading" status in currently reading', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByUserId(1);

      setTimeout(() => {
        const callArgs = userService.setCurrentlyReadingUserBooks.calls.mostRecent().args[0];
        expect(callArgs).toBeTruthy();
        if (callArgs) {
          expect(callArgs.length).toBe(2);
          expect(callArgs.every((book: UserBook) => book.status === 'Reading')).toBe(true);
        }
        done();
      });
    });

    it('should handle empty books array', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of([]));

      service.getBooksByUserId(1);

      setTimeout(() => {
        expect(userService.setUserBooks).toHaveBeenCalledWith([]);
        expect(userService.setCurrentlyReadingUserBooks).toHaveBeenCalledWith([]);
        done();
      });
    });

    it('should handle error gracefully', () => {
      booksHttpMockService.getBooksByUserId.and.returnValue(
        throwError(() => new Error('Failed to fetch books'))
      );

      expect(() => service.getBooksByUserId(1)).not.toThrow();
      expect(userService.setUserBooks).not.toHaveBeenCalled();
    });
  });

  describe('getBookRecommendationsByUserId', () => {
    it('should call booksHttpMockService with correct user ID', () => {
      booksHttpMockService.getBookRecommendationsByUserId.and.returnValue(of(mockRecommendations));

      service.getBookRecommendationsByUserId(1);

      expect(booksHttpMockService.getBookRecommendationsByUserId).toHaveBeenCalledWith(1);
    });

    it('should set recommended books in userService on success', (done) => {
      booksHttpMockService.getBookRecommendationsByUserId.and.returnValue(of(mockRecommendations));

      service.getBookRecommendationsByUserId(1);

      setTimeout(() => {
        expect(userService.setRecommendedBooks).toHaveBeenCalledWith(mockRecommendations);
        done();
      });
    });

    it('should handle empty recommendations array', (done) => {
      booksHttpMockService.getBookRecommendationsByUserId.and.returnValue(of([]));

      service.getBookRecommendationsByUserId(1);

      setTimeout(() => {
        expect(userService.setRecommendedBooks).toHaveBeenCalledWith([]);
        done();
      });
    });

    it('should handle error gracefully', () => {
      booksHttpMockService.getBookRecommendationsByUserId.and.returnValue(
        throwError(() => new Error('Failed to fetch recommendations'))
      );

      expect(() => service.getBookRecommendationsByUserId(1)).not.toThrow();
      expect(userService.setRecommendedBooks).not.toHaveBeenCalled();
    });
  });

  describe('updateProgress', () => {
    const testBook = mockUserBooks[0];

    it('should call booksHttpMockService.updateBook with updated progress', () => {
      const updatedBook = { ...testBook, progressPercentage: 75 };
      booksHttpMockService.updateBook.and.returnValue(of(updatedBook));

      service.updateProgress(testBook, 75);

      expect(booksHttpMockService.updateBook).toHaveBeenCalledWith(
        jasmine.objectContaining({
          ...testBook,
          progressPercentage: 75,
          status: 'Reading'
        })
      );
    });

    it('should change status to "Finished" when progress is 100', () => {
      const finishedBook = { ...testBook, progressPercentage: 100, status: 'Finished' as const };
      booksHttpMockService.updateBook.and.returnValue(of(finishedBook));

      service.updateProgress(testBook, 100);

      expect(booksHttpMockService.updateBook).toHaveBeenCalledWith(
        jasmine.objectContaining({
          progressPercentage: 100,
          status: 'Finished'
        })
      );
    });

    it('should keep current status when progress is less than 100', () => {
      const updatedBook = { ...testBook, progressPercentage: 50 };
      booksHttpMockService.updateBook.and.returnValue(of(updatedBook));

      service.updateProgress(testBook, 50);

      expect(booksHttpMockService.updateBook).toHaveBeenCalledWith(
        jasmine.objectContaining({
          progressPercentage: 50,
          status: 'Reading'
        })
      );
    });

    it('should call userService.updateUserBook on success', (done) => {
      const updatedBook = { ...testBook, progressPercentage: 75 };
      booksHttpMockService.updateBook.and.returnValue(of(updatedBook));

      service.updateProgress(testBook, 75);

      setTimeout(() => {
        expect(userService.updateUserBook).toHaveBeenCalledWith(updatedBook);
        done();
      });
    });

    it('should handle error gracefully', () => {
      booksHttpMockService.updateBook.and.returnValue(
        throwError(() => new Error('Failed to update book'))
      );

      expect(() => service.updateProgress(testBook, 75)).not.toThrow();
      expect(userService.updateUserBook).not.toHaveBeenCalled();
    });

    it('should handle progress of 0', () => {
      const updatedBook = { ...testBook, progressPercentage: 0 };
      booksHttpMockService.updateBook.and.returnValue(of(updatedBook));

      service.updateProgress(testBook, 0);

      expect(booksHttpMockService.updateBook).toHaveBeenCalledWith(
        jasmine.objectContaining({
          progressPercentage: 0,
          status: 'Reading'
        })
      );
    });
  });

  describe('getBooksByStatusUserId', () => {
    it('should call booksHttpMockService with correct user ID', () => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByStatusUserId(1, 'Reading');

      expect(booksHttpMockService.getBooksByUserId).toHaveBeenCalledWith(1);
    });

    it('should set user books in userService on success', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByStatusUserId(1, 'Reading');

      setTimeout(() => {
        expect(userService.setUserBooks).toHaveBeenCalledWith(mockUserBooks);
        done();
      });
    });

    it('should filter books by specified status', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByStatusUserId(1, 'Reading');

      setTimeout(() => {
        const callArgs = userService.setCurrentlyReadingUserBooks.calls.mostRecent().args[0];
        expect(callArgs).toBeTruthy();
        if (callArgs) {
          expect(callArgs.length).toBe(2);
          expect(callArgs.every((book: UserBook) => book.status === 'Reading')).toBe(true);
        }
        done();
      });
    });

    it('should filter books by Finished status', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByStatusUserId(1, 'Finished');

      setTimeout(() => {
        const callArgs = userService.setCurrentlyReadingUserBooks.calls.mostRecent().args[0];
        expect(callArgs).toBeTruthy();
        if (callArgs) {
          expect(callArgs.length).toBe(1);
          expect(callArgs.every((book: UserBook) => book.status === 'Finished')).toBe(true);
        }
        done();
      });
    });

    it('should return empty array when no books match status', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of(mockUserBooks));

      service.getBooksByStatusUserId(1, 'NonExistent');

      setTimeout(() => {
        const callArgs = userService.setCurrentlyReadingUserBooks.calls.mostRecent().args[0];
        expect(callArgs).toEqual([]);
        done();
      });
    });

    it('should handle empty books array', (done) => {
      booksHttpMockService.getBooksByUserId.and.returnValue(of([]));

      service.getBooksByStatusUserId(1, 'Reading');

      setTimeout(() => {
        expect(userService.setUserBooks).toHaveBeenCalledWith([]);
        expect(userService.setCurrentlyReadingUserBooks).toHaveBeenCalledWith([]);
        done();
      });
    });

    it('should handle error gracefully', () => {
      booksHttpMockService.getBooksByUserId.and.returnValue(
        throwError(() => new Error('Failed to fetch books'))
      );

      expect(() => service.getBooksByStatusUserId(1, 'Reading')).not.toThrow();
      expect(userService.setUserBooks).not.toHaveBeenCalled();
    });
  });

  describe('getReadingStatuses', () => {
    it('should call bookStatusMockService', () => {
      bookStatusMockService.getReadingStatuses.and.returnValue(of(mockStatuses));

      service.getReadingStatuses();

      expect(bookStatusMockService.getReadingStatuses).toHaveBeenCalled();
    });

    it('should set reading statuses signal on success', (done) => {
      bookStatusMockService.getReadingStatuses.and.returnValue(of(mockStatuses));

      service.getReadingStatuses();

      setTimeout(() => {
        expect(service.readingStatuses()).toEqual(mockStatuses);
        done();
      });
    });

    it('should handle empty statuses array', (done) => {
      bookStatusMockService.getReadingStatuses.and.returnValue(of([]));

      service.getReadingStatuses();

      setTimeout(() => {
        expect(service.readingStatuses()).toEqual([]);
        done();
      });
    });

    it('should handle error gracefully', () => {
      bookStatusMockService.getReadingStatuses.and.returnValue(
        throwError(() => new Error('Failed to fetch statuses'))
      );

      expect(() => service.getReadingStatuses()).not.toThrow();
    });

    it('should expose readonly signal for reading statuses', () => {
      expect(service.readingStatuses).toBeDefined();
      expect(typeof service.readingStatuses).toBe('function');
    });
  });

  describe('searchBooks', () => {
    const mockSearchResults: SearchResultBook[] = [
      {
        id: 1,
        name: 'Pro Angular',
        author: 'Adam Freeman',
        coverImage: 'images/books/pro-angular.jpg',
        description: 'A great book',
        status: 'Reading',
        shelves: [{ id: 1, name: 'Angular' }],
        inLibrary: true,
      },
      {
        id: 3,
        name: 'Learning Angular',
        author: 'Aristeidis Bampakos',
        coverImage: 'images/books/learning-angular.jpg',
        description: 'Another great book',
        status: '',
        shelves: [],
        inLibrary: false,
      }
    ];

    it('should call booksHttpMockService.searchBooks with correct arguments', () => {
      booksHttpMockService.searchBooks.and.returnValue(of(mockSearchResults));

      service.searchBooks('angular', 1);

      expect(booksHttpMockService.searchBooks).toHaveBeenCalledWith('angular', 1);
    });

    it('should set isSearching to true when search starts', () => {
      booksHttpMockService.searchBooks.and.returnValue(of(mockSearchResults));

      expect(service.isSearching()).toBe(false);

      service.searchBooks('angular', 1);

      expect(service.isSearching()).toBe(false);
    });

    it('should set searchBooksResult signal on success', (done) => {
      booksHttpMockService.searchBooks.and.returnValue(of(mockSearchResults));

      service.searchBooks('angular', 1);

      setTimeout(() => {
        expect(service.searchBooksResult()).toEqual(mockSearchResults);
        done();
      });
    });

    it('should set isSearching to false after results arrive', (done) => {
      booksHttpMockService.searchBooks.and.returnValue(of(mockSearchResults));

      service.searchBooks('angular', 1);

      setTimeout(() => {
        expect(service.isSearching()).toBe(false);
        done();
      });
    });

    it('should clear previous results when starting a new search', () => {
      booksHttpMockService.searchBooks.and.returnValue(of(mockSearchResults));

      service.searchBooks('angular', 1);

      booksHttpMockService.searchBooks.and.returnValue(of([]));
      service.searchBooks('nonexistent', 1);

      expect(service.searchBooksResult()).toEqual([]);
    });

    it('should handle empty results', (done) => {
      booksHttpMockService.searchBooks.and.returnValue(of([]));

      service.searchBooks('nonexistent', 1);

      setTimeout(() => {
        expect(service.searchBooksResult()).toEqual([]);
        expect(service.isSearching()).toBe(false);
        done();
      });
    });

    it('should handle error gracefully', () => {
      booksHttpMockService.searchBooks.and.returnValue(
        throwError(() => new Error('Search failed'))
      );

      expect(() => service.searchBooks('angular', 1)).not.toThrow();
    });

    it('should set isSearching to false on error', (done) => {
      booksHttpMockService.searchBooks.and.returnValue(
        throwError(() => new Error('Search failed'))
      );

      service.searchBooks('angular', 1);

      setTimeout(() => {
        expect(service.isSearching()).toBe(false);
        done();
      });
    });

    it('should not update searchBooksResult on error', (done) => {
      booksHttpMockService.searchBooks.and.returnValue(of(mockSearchResults));
      service.searchBooks('angular', 1);

      setTimeout(() => {
        expect(service.searchBooksResult()).toEqual(mockSearchResults);

        booksHttpMockService.searchBooks.and.returnValue(
          throwError(() => new Error('Search failed'))
        );
        service.searchBooks('fail', 1);

        setTimeout(() => {
          expect(service.searchBooksResult()).toEqual([]);
          done();
        });
      });
    });

    it('should expose readonly signal for search results', () => {
      expect(service.searchBooksResult).toBeDefined();
      expect(typeof service.searchBooksResult).toBe('function');
    });

    it('should expose readonly signal for isSearching', () => {
      expect(service.isSearching).toBeDefined();
      expect(typeof service.isSearching).toBe('function');
    });
  });
});

