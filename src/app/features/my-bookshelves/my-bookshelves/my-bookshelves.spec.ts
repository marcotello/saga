import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MyBookShelves } from './my-bookshelves';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { BooksService } from '../../../core/services/books-service';
import { BookshelvesHttpMockService } from '../../../core/mock-api/mock-http-services/bookshelves-http-mock-service';
import { BooksHttpMockService } from '../../../core/mock-api/mock-http-services/books-http-mock-service';
import { Bookshelf } from '../../../core/models/bookshelf';
import { UserBook } from '../../../core/models/user-book';
import { of } from 'rxjs';

describe('MyBookShelves', () => {
  let component: MyBookShelves;
  let fixture: ComponentFixture<MyBookShelves>;
  let mockBookshelvesHttpService: jasmine.SpyObj<BookshelvesHttpMockService>;
  let mockBooksHttpService: jasmine.SpyObj<BooksHttpMockService>;
  let bookshelfService: BookshelfService;
  let booksService: BooksService;

  const mockShelves: Bookshelf[] = [
    { id: 1, name: 'Fiction', image: '/images/fiction.svg', userId: 1 },
    { id: 2, name: 'Angular', image: '/images/angular.svg', userId: 1 },
    { id: 3, name: 'Science', image: '/images/science.svg', userId: 1 }
  ];

  const mockBooks: UserBook[] = [
    {
      id: 1,
      name: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverImage: '/images/gatsby.jpg',
      progressPercentage: 50,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      userId: 1,
      genreId: 1,
      status: 'Reading',
      shelves: [{ id: 1, name: 'Fiction' }]
    },
    {
      id: 2,
      name: 'Clean Code',
      author: 'Robert C. Martin',
      coverImage: '/images/cleancode.jpg',
      progressPercentage: 100,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      userId: 1,
      genreId: 2,
      status: 'Finished',
      shelves: [{ id: 1, name: 'Fiction' }]
    }
  ];

  beforeEach(fakeAsync(() => {
    mockBookshelvesHttpService = jasmine.createSpyObj('BookshelvesHttpMockService', [
      'getBookshelvesByUserId',
      'addBookshelf',
      'updateBookshelf',
      'deleteBookshelf',
      'removeBookFromShelf'
    ]);
    mockBooksHttpService = jasmine.createSpyObj('BooksHttpMockService', [
      'getBooksByBookshelfId',
      'getBooksByUserId',
      'updateBook',
      'getBookRecommendationsByUserId'
    ]);

    mockBookshelvesHttpService.getBookshelvesByUserId.and.returnValue(of(mockShelves));
    mockBooksHttpService.getBooksByBookshelfId.and.returnValue(of(mockBooks));

    TestBed.configureTestingModule({
      imports: [MyBookShelves],
      providers: [
        provideHttpClient(),
        BookshelfService,
        BooksService,
        { provide: BookshelvesHttpMockService, useValue: mockBookshelvesHttpService },
        { provide: BooksHttpMockService, useValue: mockBooksHttpService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookShelves);
    component = fixture.componentInstance;
    bookshelfService = TestBed.inject(BookshelfService);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should call getBookshelvesByUserId on construction', () => {
      expect(mockBookshelvesHttpService.getBookshelvesByUserId).toHaveBeenCalled();
    });

    it('should have shelves sorted alphabetically', () => {
      const shelves = component.shelves();
      expect(shelves.length).toBe(3);
      expect(shelves[0].name).toBe('Angular');
      expect(shelves[1].name).toBe('Fiction');
      expect(shelves[2].name).toBe('Science');
    });

    it('should auto-select the first shelf', () => {
      // After sorting, first shelf is "Angular" (id: 2)
      const selected = component.selectedShelf();
      expect(selected).toBeTruthy();
      expect(selected?.name).toBe('Angular');
    });

    it('should load books for the selected shelf', () => {
      expect(mockBooksHttpService.getBooksByBookshelfId).toHaveBeenCalled();
    });

    it('should have books loaded', () => {
      expect(component.books()).toBeTruthy();
      expect(component.books()?.length).toBe(2);
    });

    it('should have bookPluralMapping defined', () => {
      expect(component.bookPluralMapping['=0']).toBe('No books');
      expect(component.bookPluralMapping['=1']).toBe('1 book');
      expect(component.bookPluralMapping['other']).toBe('# books');
    });
  });

  describe('Shelf selection', () => {
    it('should update selectedShelf when selectShelf is called', () => {
      const shelf = mockShelves[0]; // Fiction
      component.selectShelf(shelf);

      expect(component.selectedShelf()).toEqual(shelf);
    });

    it('should call getBooksByBookshelfId when a shelf is selected', () => {
      mockBooksHttpService.getBooksByBookshelfId.calls.reset();
      const shelf = mockShelves[0];

      component.selectShelf(shelf);

      expect(mockBooksHttpService.getBooksByBookshelfId).toHaveBeenCalledWith(shelf.id, 1);
    });
  });

  describe('Add bookshelf dialog', () => {
    it('should open add dialog when createShelf is called', () => {
      component.createShelf();
      expect((component as any).isAddBookDialogOpen()).toBe(true);
    });

    it('should close add dialog when onAddBookDialogRequestClose is called', () => {
      component.createShelf();
      expect((component as any).isAddBookDialogOpen()).toBe(true);

      component.onAddBookDialogRequestClose();
      expect((component as any).isAddBookDialogOpen()).toBe(false);
    });
  });

  describe('Update bookshelf dialog', () => {
    it('should open update dialog when updateShelf is called', () => {
      component.updateShelf();
      expect((component as any).isUpdateBookshelfDialogOpen()).toBe(true);
    });

    it('should close update dialog when onUpdateBookshelfDialogRequestClose is called with null', () => {
      component.updateShelf();
      component.onUpdateBookshelfDialogRequestClose(null);
      expect((component as any).isUpdateBookshelfDialogOpen()).toBe(false);
    });

    it('should update selectedShelf when onUpdateBookshelfDialogRequestClose receives an updated shelf', () => {
      const updatedShelf: Bookshelf = { id: 1, name: 'Updated Fiction', image: '/images/updated.svg', userId: 1 };
      component.updateShelf();
      component.onUpdateBookshelfDialogRequestClose(updatedShelf);

      expect(component.selectedShelf()).toEqual(updatedShelf);
      expect((component as any).isUpdateBookshelfDialogOpen()).toBe(false);
    });

    it('should not update selectedShelf when dialog is closed with null', () => {
      const currentShelf = component.selectedShelf();
      component.updateShelf();
      component.onUpdateBookshelfDialogRequestClose(null);

      expect(component.selectedShelf()).toEqual(currentShelf);
    });
  });

  describe('Delete bookshelf dialog', () => {
    it('should open delete dialog when deleteShelf is called', () => {
      component.deleteShelf();
      expect((component as any).isDeleteBookshelfDialogOpen()).toBe(true);
    });

    it('should call deleteBookshelf on service when confirmed', () => {
      spyOn(bookshelfService, 'deleteBookshelf');
      const selectedShelf = component.selectedShelf();

      component.deleteShelf();
      component.onDeleteBookshelfConfirmed();

      expect(bookshelfService.deleteBookshelf).toHaveBeenCalledWith(selectedShelf!.id);
    });

    it('should select next shelf after deletion', () => {
      spyOn(bookshelfService, 'deleteBookshelf');
      const selectedId = component.selectedShelf()!.id;

      component.deleteShelf();
      component.onDeleteBookshelfConfirmed();

      // After deleting the selected shelf, another shelf should be selected
      expect(component.selectedShelf()?.id).not.toBe(selectedId);
    });

    it('should close delete dialog after confirmation', () => {
      spyOn(bookshelfService, 'deleteBookshelf');
      component.deleteShelf();
      component.onDeleteBookshelfConfirmed();

      expect((component as any).isDeleteBookshelfDialogOpen()).toBe(false);
    });

    it('should close delete dialog when canceled', () => {
      component.deleteShelf();
      component.onDeleteBookshelfCanceled();

      expect((component as any).isDeleteBookshelfDialogOpen()).toBe(false);
    });

    it('should close delete dialog when onDeleteBookshelfDialogClosed is called', () => {
      component.deleteShelf();
      component.onDeleteBookshelfDialogClosed();

      expect((component as any).isDeleteBookshelfDialogOpen()).toBe(false);
    });
  });

  describe('Remove book from shelf', () => {
    it('should open remove book dialog when removeBookFromShelf is called', () => {
      component.removeBookFromShelf(mockBooks[0]);
      expect((component as any).isRemoveBookDialogOpen()).toBe(true);
    });

    it('should store the book to remove', () => {
      component.removeBookFromShelf(mockBooks[0]);
      expect((component as any).bookToRemove()).toEqual(mockBooks[0]);
    });

    it('should call removeBookFromShelf on service when confirmed', () => {
      spyOn(bookshelfService, 'removeBookFromShelf');
      component.removeBookFromShelf(mockBooks[0]);
      component.onRemoveBookConfirmed();

      const shelfId = component.selectedShelf()!.id;
      expect(bookshelfService.removeBookFromShelf).toHaveBeenCalledWith(shelfId, mockBooks[0].id);
    });

    it('should close remove dialog and clear book after confirmation', () => {
      spyOn(bookshelfService, 'removeBookFromShelf');
      component.removeBookFromShelf(mockBooks[0]);
      component.onRemoveBookConfirmed();

      expect((component as any).isRemoveBookDialogOpen()).toBe(false);
      expect((component as any).bookToRemove()).toBeNull();
    });

    it('should close remove dialog when canceled', () => {
      component.removeBookFromShelf(mockBooks[0]);
      component.onRemoveBookCanceled();

      expect((component as any).isRemoveBookDialogOpen()).toBe(false);
      expect((component as any).bookToRemove()).toBeNull();
    });

    it('should close remove dialog when onRemoveBookDialogClosed is called', () => {
      component.removeBookFromShelf(mockBooks[0]);
      component.onRemoveBookDialogClosed();

      expect((component as any).isRemoveBookDialogOpen()).toBe(false);
      expect((component as any).bookToRemove()).toBeNull();
    });
  });

  describe('Template rendering', () => {
    it('should render the page heading', () => {
      const heading = fixture.nativeElement.querySelector('h1');
      expect(heading).toBeTruthy();
      expect(heading.textContent.trim()).toBe('My Bookshelves');
    });

    it('should render shelves sidebar', () => {
      const sidebar = fixture.nativeElement.querySelector('.shelves-sidebar');
      expect(sidebar).toBeTruthy();
    });

    it('should render shelf items', () => {
      const shelfItems = fixture.nativeElement.querySelectorAll('.shelf-item');
      expect(shelfItems.length).toBe(3);
    });

    it('should mark active shelf with active class', () => {
      const activeShelf = fixture.nativeElement.querySelector('.shelf-item.active');
      expect(activeShelf).toBeTruthy();
    });

    it('should render "+ New Shelf" button', () => {
      const newShelfBtn = fixture.nativeElement.querySelector('.new-shelf-btn');
      expect(newShelfBtn).toBeTruthy();
      expect(newShelfBtn.textContent.trim()).toContain('New Shelf');
    });

    it('should render shelf actions card', () => {
      const actionsCard = fixture.nativeElement.querySelector('.shelf-actions-card');
      expect(actionsCard).toBeTruthy();
    });

    it('should render Update button in shelf actions', () => {
      const updateBtn = fixture.nativeElement.querySelector('.shelf-update-btn');
      expect(updateBtn).toBeTruthy();
      expect(updateBtn.textContent.trim()).toBe('Update');
    });

    it('should render Delete button in shelf actions', () => {
      const deleteBtn = fixture.nativeElement.querySelector('.shelf-delete-btn');
      expect(deleteBtn).toBeTruthy();
      expect(deleteBtn.textContent.trim()).toBe('Delete');
    });

    it('should render books table with correct headers', () => {
      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();

      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBe(6);
      expect(headers[0].textContent.trim()).toBe('Cover');
      expect(headers[1].textContent.trim()).toBe('Title');
      expect(headers[2].textContent.trim()).toBe('Author');
      expect(headers[3].textContent.trim()).toBe('Date Added');
      expect(headers[4].textContent.trim()).toBe('Status');
      expect(headers[5].textContent.trim()).toBe('Actions');
    });

    it('should render book rows when books are available', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('should render book titles', () => {
      const titles = fixture.nativeElement.querySelectorAll('.book-title');
      expect(titles.length).toBe(2);
      expect(titles[0].textContent.trim()).toBe('The Great Gatsby');
      expect(titles[1].textContent.trim()).toBe('Clean Code');
    });

    it('should render Remove buttons for each book', () => {
      const removeButtons = fixture.nativeElement.querySelectorAll('.action-btn');
      expect(removeButtons.length).toBe(2);
      expect(removeButtons[0].textContent.trim()).toBe('Remove');
    });

    it('should render add-bookshelf component', () => {
      const addBookshelf = fixture.nativeElement.querySelector('app-add-bookshelf');
      expect(addBookshelf).toBeTruthy();
    });

    it('should render update-bookshelf component', () => {
      const updateBookshelf = fixture.nativeElement.querySelector('app-update-bookshelf');
      expect(updateBookshelf).toBeTruthy();
    });

    it('should render delete-record components', () => {
      const deleteRecords = fixture.nativeElement.querySelectorAll('app-delete-record');
      expect(deleteRecords.length).toBe(2);
    });
  });

  describe('Template interactions', () => {
    it('should select shelf when clicking a shelf item', () => {
      const shelfItems = fixture.nativeElement.querySelectorAll('.shelf-item');
      shelfItems[1].click(); // Click second shelf
      fixture.detectChanges();

      expect(component.selectedShelf()?.name).toBe('Fiction');
    });

    it('should open add dialog when clicking New Shelf button', () => {
      const newShelfBtn = fixture.nativeElement.querySelector('.new-shelf-btn');
      newShelfBtn.click();
      fixture.detectChanges();

      expect((component as any).isAddBookDialogOpen()).toBe(true);
    });

    it('should open update dialog when clicking Update button', () => {
      const updateBtn = fixture.nativeElement.querySelector('.shelf-update-btn');
      updateBtn.click();
      fixture.detectChanges();

      expect((component as any).isUpdateBookshelfDialogOpen()).toBe(true);
    });

    it('should open delete dialog when clicking Delete button', () => {
      const deleteBtn = fixture.nativeElement.querySelector('.shelf-delete-btn');
      deleteBtn.click();
      fixture.detectChanges();

      expect((component as any).isDeleteBookshelfDialogOpen()).toBe(true);
    });

    it('should open remove book dialog when clicking Remove button', () => {
      const removeBtn = fixture.nativeElement.querySelector('.action-btn');
      removeBtn.click();
      fixture.detectChanges();

      expect((component as any).isRemoveBookDialogOpen()).toBe(true);
    });
  });

  describe('Empty state', () => {
    it('should show empty state when no books', fakeAsync(() => {
      mockBooksHttpService.getBooksByBookshelfId.and.returnValue(of([]));
      // Select a shelf to trigger book loading with empty result
      component.selectShelf(mockShelves[0]);
      tick();
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.empty-state-cell');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent.trim()).toBe('No books in this shelf yet.');
    }));
  });
});
