import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardView } from './dashboard-view';
import { BooksService } from '../../../../core/services/books-service';
import { BookshelfService } from '../../../../core/services/bookshelf-service';
import { UserService } from '../../../../core/services/user-service';
import { signal } from '@angular/core';
import { UserBook } from '../../../../core/models/user-book';
import { Bookshelf } from '../../../../core/models/bookshelf';
import { BookRecommendation } from '../../../../core/models/book-recommendation';
import { UserStatistics } from '../../../../core/models/user-statistics';
import { User } from '../../../../core/models/user';

describe('DashboardView', () => {
  let component: DashboardView;
  let fixture: ComponentFixture<DashboardView>;
  let booksService: jasmine.SpyObj<BooksService>;
  let bookshelfService: jasmine.SpyObj<BookshelfService>;
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

  beforeEach(async () => {
    const booksServiceSpy = jasmine.createSpyObj('BooksService', [
      'getBooksByUserId',
      'getBookRecommendationsByUserId',
      'updateProgress'
    ]);
    
    const bookshelfServiceSpy = jasmine.createSpyObj('BookshelfService', [
      'getBookshelvesByUserId'
    ]);
    
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getStatisticsByUserId'
    ], {
      user: signal(mockUser),
      currentlyReadingUserBooks: signal(mockBooks),
      userBookshelves: signal(mockBookshelves),
      recommendedBooks: signal(mockRecommendations),
      userStatistics: signal(mockStatistics)
    });

    await TestBed.configureTestingModule({
      imports: [DashboardView],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy },
        { provide: BookshelfService, useValue: bookshelfServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardView);
    component = fixture.componentInstance;
    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    bookshelfService = TestBed.inject(BookshelfService) as jasmine.SpyObj<BookshelfService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Constructor initialization', () => {
    it('should call getBooksByUserId on initialization', () => {
      expect(booksService.getBooksByUserId).toHaveBeenCalledWith(1);
    });

    it('should call getBookshelvesByUserId on initialization', () => {
      expect(bookshelfService.getBookshelvesByUserId).toHaveBeenCalledWith(1);
    });

    it('should call getBookRecommendationsByUserId on initialization', () => {
      expect(booksService.getBookRecommendationsByUserId).toHaveBeenCalledWith(1);
    });

    it('should call getStatisticsByUserId on initialization', () => {
      expect(userService.getStatisticsByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('Signals', () => {
    it('should expose books signal from userService', () => {
      expect(component['books']()).toEqual(mockBooks);
    });

    it('should expose bookshelves signal from userService', () => {
      expect(component['bookshelves']()).toEqual(mockBookshelves);
    });

    it('should expose recommendedBooks signal from userService', () => {
      expect(component['recommendedBooks']()).toEqual(mockRecommendations);
    });

    it('should expose statistics signal from userService', () => {
      expect(component['statistics']()).toEqual(mockStatistics);
    });

    it('should initialize isUpdateProgressOpen as false', () => {
      expect(component['isUpdateProgressOpen']()).toBe(false);
    });

    it('should initialize selectedBook as null', () => {
      expect(component['selectedBook']()).toBeNull();
    });
  });

  describe('onUpdateProgress', () => {
    it('should set selectedBook', () => {
      component.onUpdateProgress(mockBooks[0]);
      
      expect(component['selectedBook']()).toEqual(mockBooks[0]);
    });

    it('should open update progress dialog', () => {
      component.onUpdateProgress(mockBooks[0]);
      
      expect(component['isUpdateProgressOpen']()).toBe(true);
    });
  });

  describe('onSaveProgress', () => {
    beforeEach(() => {
      component['selectedBook'].set(mockBooks[0]);
      component['isUpdateProgressOpen'].set(true);
    });

    it('should call booksService.updateProgress with correct parameters', () => {
      component.onSaveProgress(75);
      
      expect(booksService.updateProgress).toHaveBeenCalledWith(mockBooks[0], 75);
    });

    it('should close update progress dialog', () => {
      component.onSaveProgress(75);
      
      expect(component['isUpdateProgressOpen']()).toBe(false);
    });

    it('should clear selectedBook', () => {
      component.onSaveProgress(75);
      
      expect(component['selectedBook']()).toBeNull();
    });

    it('should not call updateProgress if no book is selected', () => {
      component['selectedBook'].set(null);
      
      component.onSaveProgress(75);
      
      expect(booksService.updateProgress).not.toHaveBeenCalled();
    });
  });

  describe('onCancelProgress', () => {
    beforeEach(() => {
      component['selectedBook'].set(mockBooks[0]);
      component['isUpdateProgressOpen'].set(true);
    });

    it('should close update progress dialog', () => {
      component.onCancelProgress();
      
      expect(component['isUpdateProgressOpen']()).toBe(false);
    });

    it('should clear selectedBook', () => {
      component.onCancelProgress();
      
      expect(component['selectedBook']()).toBeNull();
    });
  });

  describe('onAddBook', () => {
    it('should log message to console', () => {
      spyOn(console, 'log');
      
      component.onAddBook();
      
      expect(console.log).toHaveBeenCalledWith('Add book clicked');
    });
  });

  describe('onShelfClick', () => {
    it('should do nothing (placeholder for future navigation)', () => {
      expect(() => component.onShelfClick()).not.toThrow();
    });
  });

  describe('onAddShelf', () => {
    it('should log message to console', () => {
      spyOn(console, 'log');
      
      component.onAddShelf();
      
      expect(console.log).toHaveBeenCalledWith('Add shelf clicked');
    });
  });

  describe('onBookSuggestionClick', () => {
    it('should log book information to console', () => {
      spyOn(console, 'log');
      
      component.onBookSuggestionClick(mockRecommendations[0]);
      
      expect(console.log).toHaveBeenCalledWith('Book suggestion clicked:', 'Recommended Book');
    });
  });

  describe('Component integration', () => {
    it('should have OnPush change detection strategy', () => {
      const changeDetectionStrategy = fixture.debugElement.componentInstance.constructor.ɵcmp.changeDetection;
      expect(changeDetectionStrategy).toBe(1); // 1 = OnPush
    });

    it('should properly handle null user', () => {
      const userServiceWithNullUser = jasmine.createSpyObj('UserService', [
        'getStatisticsByUserId'
      ], {
        user: signal(null),
        currentlyReadingUserBooks: signal(null),
        userBookshelves: signal(null),
        recommendedBooks: signal(null),
        userStatistics: signal(null)
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DashboardView],
        providers: [
          { provide: BooksService, useValue: booksService },
          { provide: BookshelfService, useValue: bookshelfService },
          { provide: UserService, useValue: userServiceWithNullUser }
        ]
      });

      const newFixture = TestBed.createComponent(DashboardView);
      const newComponent = newFixture.componentInstance;
      
      // Should use default userId of 1 when user is null
      expect(newComponent['userId']).toBe(1);
    });
  });
});
