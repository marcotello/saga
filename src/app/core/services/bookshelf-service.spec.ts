import { TestBed } from '@angular/core/testing';
import { BookshelfService } from './bookshelf-service';
import { BookshelvesHttpMockService } from '../mock-api/mock-http-services/bookshelves-http-mock-service';
import { UserService } from './user-service';
import { Bookshelf } from '../models/bookshelf';
import { of, throwError } from 'rxjs';

describe('BookshelfService', () => {
  let service: BookshelfService;
  let bookshelvesHttpMockService: jasmine.SpyObj<BookshelvesHttpMockService>;
  let userService: jasmine.SpyObj<UserService>;

  const mockBookshelves: Bookshelf[] = [
    {
      id: 1,
      userId: 1,
      name: 'Fiction',
      image: 'fiction.jpg'
    },
    {
      id: 2,
      userId: 1,
      name: 'Non-Fiction',
      image: 'non-fiction.jpg'
    },
    {
      id: 3,
      userId: 1,
      name: 'Technical',
      image: 'technical.jpg'
    }
  ];

  beforeEach(() => {
    const bookshelvesHttpMockServiceSpy = jasmine.createSpyObj('BookshelvesHttpMockService', [
      'getBookshelvesByUserId'
    ]);

    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'setUserBookshelves'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BookshelfService,
        { provide: BookshelvesHttpMockService, useValue: bookshelvesHttpMockServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(BookshelfService);
    bookshelvesHttpMockService = TestBed.inject(BookshelvesHttpMockService) as jasmine.SpyObj<BookshelvesHttpMockService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBookshelvesByUserId', () => {
    it('should call bookshelvesHttpMockService with correct user ID', () => {
      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValue(of(mockBookshelves));

      service.getBookshelvesByUserId(1);

      expect(bookshelvesHttpMockService.getBookshelvesByUserId).toHaveBeenCalledWith(1);
    });

    it('should set bookshelves in userService on success', (done) => {
      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValue(of(mockBookshelves));

      service.getBookshelvesByUserId(1);

      setTimeout(() => {
        expect(userService.setUserBookshelves).toHaveBeenCalledWith(mockBookshelves);
        done();
      });
    });

    it('should handle empty bookshelves array', (done) => {
      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValue(of([]));

      service.getBookshelvesByUserId(1);

      setTimeout(() => {
        expect(userService.setUserBookshelves).toHaveBeenCalledWith([]);
        done();
      });
    });

    it('should handle error gracefully', () => {
      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValue(
        throwError(() => new Error('Failed to fetch bookshelves'))
      );

      expect(() => service.getBookshelvesByUserId(1)).not.toThrow();
      expect(userService.setUserBookshelves).not.toHaveBeenCalled();
    });

    it('should work with different user IDs', () => {
      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValue(of(mockBookshelves));

      service.getBookshelvesByUserId(2);

      expect(bookshelvesHttpMockService.getBookshelvesByUserId).toHaveBeenCalledWith(2);
    });

    it('should handle multiple calls correctly', (done) => {
      const firstCall = mockBookshelves.slice(0, 2);
      const secondCall = mockBookshelves;

      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValues(
        of(firstCall),
        of(secondCall)
      );

      service.getBookshelvesByUserId(1);

      setTimeout(() => {
        expect(userService.setUserBookshelves).toHaveBeenCalledWith(firstCall);

        service.getBookshelvesByUserId(1);

        setTimeout(() => {
          expect(userService.setUserBookshelves).toHaveBeenCalledWith(secondCall);
          expect(userService.setUserBookshelves).toHaveBeenCalledTimes(2);
          done();
        });
      });
    });

    it('should preserve bookshelf data structure', (done) => {
      bookshelvesHttpMockService.getBookshelvesByUserId.and.returnValue(of(mockBookshelves));

      service.getBookshelvesByUserId(1);

      setTimeout(() => {
        const callArgs = userService.setUserBookshelves.calls.mostRecent().args[0];
        expect(callArgs).toBeTruthy();
        if (callArgs && callArgs[0]) {
          expect(callArgs[0]).toEqual(jasmine.objectContaining({
            id: 1,
            userId: 1,
            name: 'Fiction',
            image: 'fiction.jpg'
          }));
        }
        done();
      });
    });
  });
});

