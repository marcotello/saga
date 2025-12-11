import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service';
import { UserHttpMockService } from '../mock-api/mock-http-services/user-http-mock-service';
import { User } from '../models/user';
import { UserBook } from '../models/user-book';
import { Bookshelf } from '../models/bookshelf';
import { BookRecommendation } from '../models/book-recommendation';
import { UserStatistics } from '../models/user-statistics';
import { of, throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let userHttpMockService: jasmine.SpyObj<UserHttpMockService>;

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

  const mockUserBooks: UserBook[] = [
    {
      id: 1,
      userId: 1,
      name: 'Test Book',
      author: 'Test Author',
      coverImage: 'test.jpg',
      status: 'Reading',
      progressPercentage: 50,
      genreId: 1,
      shelves: [1],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  const mockBookshelves: Bookshelf[] = [
    {
      id: 1,
      userId: 1,
      name: 'Test Shelf',
      image: 'test.jpg'
    }
  ];

  const mockRecommendations: BookRecommendation[] = [
    {
      id: 1,
      userId: 1,
      name: 'Recommended Book',
      author: 'Test Author',
      coverImage: 'test.jpg'
    }
  ];

  const mockStatistics: UserStatistics = {
    userId: 1,
    readBooks: 38,
    totalPages: 12345,
    monthlyBooks: [
      { month: 'January', booksRead: 3 },
      { month: 'February', booksRead: 2 }
    ]
  };

  beforeEach(() => {
    const userHttpMockServiceSpy = jasmine.createSpyObj('UserHttpMockService', [
      'updateProfileById',
      'updatePassword',
      'getStatisticsByUserId'
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: UserHttpMockService, useValue: userHttpMockServiceSpy }
      ]
    });

    service = TestBed.inject(UserService);
    userHttpMockService = TestBed.inject(UserHttpMockService) as jasmine.SpyObj<UserHttpMockService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUser', () => {
    it('should set user signal', () => {
      service.setUser(mockUser);
      expect(service.user()).toEqual(mockUser);
    });

    it('should set user to null', () => {
      service.setUser(mockUser);
      service.setUser(null);
      expect(service.user()).toBeNull();
    });
  });

  describe('updateProfileById', () => {
    it('should call userHttpMockService and update user signal on success', (done) => {
      const updatedUser = { ...mockUser, name: 'Updated' };
      userHttpMockService.updateProfileById.and.returnValue(of(updatedUser));

      service.updateProfileById(updatedUser);

      expect(userHttpMockService.updateProfileById).toHaveBeenCalledWith(updatedUser.id, updatedUser);
      
      // Wait for async operation
      setTimeout(() => {
        expect(service.user()).toEqual(updatedUser);
        done();
      });
    });

    it('should handle error gracefully', () => {
      userHttpMockService.updateProfileById.and.returnValue(
        throwError(() => new Error('Update failed'))
      );

      expect(() => service.updateProfileById(mockUser)).not.toThrow();
    });
  });

  describe('updatePassword', () => {
    it('should call userHttpMockService with correct parameters', () => {
      userHttpMockService.updatePassword.and.returnValue(of(mockUser));

      service.updatePassword(1, 'oldpass', 'newpass');

      expect(userHttpMockService.updatePassword).toHaveBeenCalledWith(
        1,
        { currentPassword: 'oldpass', newPassword: 'newpass' }
      );
    });

    it('should update user signal on success', (done) => {
      userHttpMockService.updatePassword.and.returnValue(of(mockUser));

      service.updatePassword(1, 'oldpass', 'newpass');

      setTimeout(() => {
        expect(service.user()).toEqual(mockUser);
        done();
      });
    });

    it('should handle error gracefully', () => {
      userHttpMockService.updatePassword.and.returnValue(
        throwError(() => new Error('Password update failed'))
      );

      expect(() => service.updatePassword(1, 'oldpass', 'newpass')).not.toThrow();
    });
  });

  describe('setUserBooks', () => {
    it('should set userBooks signal', () => {
      service.setUserBooks(mockUserBooks);
      expect(service.userBooks()).toEqual(mockUserBooks);
    });

    it('should set userBooks to null', () => {
      service.setUserBooks(mockUserBooks);
      service.setUserBooks(null);
      expect(service.userBooks()).toBeNull();
    });
  });

  describe('setCurrentlyReadingUserBooks', () => {
    it('should set currentlyReadingUserBooks signal', () => {
      service.setCurrentlyReadingUserBooks(mockUserBooks);
      expect(service.currentlyReadingUserBooks()).toEqual(mockUserBooks);
    });
  });

  describe('updateUserBook', () => {
    it('should update book in userBooks signal', () => {
      service.setUserBooks(mockUserBooks);
      
      const updatedBook = { ...mockUserBooks[0], progressPercentage: 75 };
      service.updateUserBook(updatedBook);

      expect(service.userBooks()?.[0].progressPercentage).toBe(75);
    });

    it('should update book in currentlyReadingUserBooks signal', () => {
      service.setCurrentlyReadingUserBooks(mockUserBooks);
      
      const updatedBook = { ...mockUserBooks[0], progressPercentage: 75 };
      service.updateUserBook(updatedBook);

      expect(service.currentlyReadingUserBooks()?.[0].progressPercentage).toBe(75);
    });

    it('should filter out finished books from currentlyReadingUserBooks', () => {
      service.setCurrentlyReadingUserBooks(mockUserBooks);
      
      const finishedBook = { ...mockUserBooks[0], status: 'Finished' as const };
      service.updateUserBook(finishedBook);

      expect(service.currentlyReadingUserBooks()?.length).toBe(0);
    });

    it('should handle null userBooks', () => {
      service.setUserBooks(null);
      
      const updatedBook = { ...mockUserBooks[0], progressPercentage: 75 };
      
      expect(() => service.updateUserBook(updatedBook)).not.toThrow();
      expect(service.userBooks()).toBeNull();
    });
  });

  describe('setUserBookshelves', () => {
    it('should set userBookshelves signal', () => {
      service.setUserBookshelves(mockBookshelves);
      expect(service.userBookshelves()).toEqual(mockBookshelves);
    });
  });

  describe('setRecommendedBooks', () => {
    it('should set recommendedBooks signal', () => {
      service.setRecommendedBooks(mockRecommendations);
      expect(service.recommendedBooks()).toEqual(mockRecommendations);
    });
  });

  describe('getStatisticsByUserId', () => {
    it('should call userHttpMockService with correct user ID', () => {
      userHttpMockService.getStatisticsByUserId.and.returnValue(of(mockStatistics));

      service.getStatisticsByUserId(1);

      expect(userHttpMockService.getStatisticsByUserId).toHaveBeenCalledWith(1);
    });

    it('should update userStatistics signal on success', (done) => {
      userHttpMockService.getStatisticsByUserId.and.returnValue(of(mockStatistics));

      service.getStatisticsByUserId(1);

      setTimeout(() => {
        expect(service.userStatistics()).toEqual(mockStatistics);
        done();
      });
    });

    it('should handle null statistics', (done) => {
      userHttpMockService.getStatisticsByUserId.and.returnValue(of(null));

      service.getStatisticsByUserId(999);

      setTimeout(() => {
        expect(service.userStatistics()).toBeNull();
        done();
      });
    });

    it('should handle error gracefully', () => {
      userHttpMockService.getStatisticsByUserId.and.returnValue(
        throwError(() => new Error('Failed to fetch statistics'))
      );

      expect(() => service.getStatisticsByUserId(1)).not.toThrow();
    });
  });
});

