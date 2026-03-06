import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AddToShelf } from './add-to-shelf';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';
import { SearchResultBook } from '../../../core/models/search-result-book';
import { Bookshelf } from '../../../core/models/bookshelf';
import { User } from '../../../core/models/user';

describe('AddToShelf', () => {
  let component: AddToShelf;
  let fixture: ComponentFixture<AddToShelf>;
  let mockBooksService: jasmine.SpyObj<BooksService>;

  const mockUser: User = {
    id: 1, username: 'testuser', name: 'Test', lastName: 'User',
    email: 'test@example.com', bio: null, role: 'User', profilePicture: 'default.jpg'
  };

  const mockBookshelves: Bookshelf[] = [
    { id: 1, name: 'Angular', image: 'angular.svg', userId: 1 },
    { id: 2, name: 'JavaScript', image: 'js.svg', userId: 1 },
    { id: 3, name: 'Python', image: 'python.svg', userId: 1 },
  ];

  const mockBook: SearchResultBook = {
    id: 5, name: 'Learning Angular', author: 'Aristeidis Bampakos',
    coverImage: 'img.jpg', description: 'A great book',
    status: '', shelves: [], inLibrary: false,
  };

  const userBookshelvesSignal = signal<Bookshelf[] | null>(null);
  const userSignal = signal<User | null>(mockUser);

  beforeEach(async () => {
    userBookshelvesSignal.set(mockBookshelves);
    userSignal.set(mockUser);

    mockBooksService = jasmine.createSpyObj('BooksService', ['addBookToShelf']);

    const mockUserService = jasmine.createSpyObj('UserService', [], {
      userBookshelves: userBookshelvesSignal,
      user: userSignal,
    });

    await TestBed.configureTestingModule({
      imports: [AddToShelf],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: UserService, useValue: mockUserService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToShelf);
    component = fixture.componentInstance;
    spyOn(component.requestClose, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with dialog closed', () => {
      expect(component.isDialogOpen()).toBe(false);
    });

    it('should have correct dialog title', () => {
      expect(component.dialogTitle).toBe('Select a Bookshelf');
    });

    it('should initialize with no shelf selected', () => {
      expect(component.selectedShelfId()).toBeNull();
    });

    it('should initialize with null book', () => {
      expect(component.book()).toBeNull();
    });

    it('should compute bookshelves from userService', () => {
      expect(component.bookshelves()).toEqual(mockBookshelves);
    });

    it('should return empty array when userBookshelves is null', () => {
      userBookshelvesSignal.set(null);
      expect(component.bookshelves()).toEqual([]);
    });
  });

  describe('Dialog management', () => {
    it('should emit requestClose when closeDialog is called', () => {
      component.closeDialog();
      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should reset selectedShelfId when dialog is closed', () => {
      component.selectedShelfId.set(2);
      component.closeDialog();
      expect(component.selectedShelfId()).toBeNull();
    });
  });

  describe('onShelfChange', () => {
    it('should set selectedShelfId from select event', () => {
      const event = { target: { value: '2' } } as unknown as Event;
      component.onShelfChange(event);
      expect(component.selectedShelfId()).toBe(2);
    });

    it('should set selectedShelfId to null when empty value selected', () => {
      component.selectedShelfId.set(2);
      const event = { target: { value: '' } } as unknown as Event;
      component.onShelfChange(event);
      expect(component.selectedShelfId()).toBeNull();
    });
  });

  describe('onAdd', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();
    });

    it('should call booksService.addBookToShelf with correct arguments', () => {
      component.selectedShelfId.set(2);
      component.onAdd();

      expect(mockBooksService.addBookToShelf).toHaveBeenCalledWith(
        mockBook, 2, 'JavaScript', 1
      );
    });

    it('should close dialog after adding', () => {
      component.selectedShelfId.set(1);
      component.onAdd();
      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should reset selectedShelfId after adding', () => {
      component.selectedShelfId.set(1);
      component.onAdd();
      expect(component.selectedShelfId()).toBeNull();
    });

    it('should not call booksService when no shelf is selected', () => {
      component.selectedShelfId.set(null);
      component.onAdd();
      expect(mockBooksService.addBookToShelf).not.toHaveBeenCalled();
    });

    it('should not call booksService when no book is set', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();
      component.selectedShelfId.set(1);
      component.onAdd();
      expect(mockBooksService.addBookToShelf).not.toHaveBeenCalled();
    });

    it('should not call booksService when selected shelf does not exist', () => {
      component.selectedShelfId.set(999);
      component.onAdd();
      expect(mockBooksService.addBookToShelf).not.toHaveBeenCalled();
    });

    it('should use userId 0 when user is null', () => {
      userSignal.set(null);
      component.selectedShelfId.set(1);
      component.onAdd();

      expect(mockBooksService.addBookToShelf).toHaveBeenCalledWith(
        mockBook, 1, 'Angular', 0
      );
    });
  });

  describe('Template rendering', () => {
    it('should render dialog component', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
    });

    it('should display book name when book is provided', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      const bookName = fixture.nativeElement.querySelector('.add-to-shelf__book-name');
      expect(bookName).toBeTruthy();
      expect(bookName.textContent).toContain('Learning Angular');
    });

    it('should not display book name when book is null', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      const bookName = fixture.nativeElement.querySelector('.add-to-shelf__book-name');
      expect(bookName).toBeFalsy();
    });

    it('should render select with bookshelf options', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('#bookshelfSelect');
      expect(select).toBeTruthy();

      const options = select.querySelectorAll('option');
      expect(options.length).toBe(mockBookshelves.length + 1);
      expect(options[0].textContent).toContain('Choose a bookshelf');
      expect(options[1].textContent).toContain('Angular');
      expect(options[2].textContent).toContain('JavaScript');
      expect(options[3].textContent).toContain('Python');
    });

    it('should render Cancel button with btn-amber class', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const cancelButton = fixture.nativeElement.querySelector('.btn-amber');
      expect(cancelButton).toBeTruthy();
      expect(cancelButton.textContent.trim()).toBe('Cancel');
    });

    it('should close dialog when Cancel button is clicked', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const cancelButton = fixture.nativeElement.querySelector('.btn-amber');
      cancelButton.click();
      fixture.detectChanges();

      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should render Add button', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('.dialog-footer button');
      const addButton = buttons[1];
      expect(addButton).toBeTruthy();
      expect(addButton.textContent.trim()).toBe('Add');
    });

    it('should disable Add button when no shelf is selected', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('.dialog-footer button');
      const addButton = buttons[1];
      expect(addButton.disabled).toBe(true);
    });

    it('should enable Add button when a shelf is selected', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      component.selectedShelfId.set(1);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('.dialog-footer button');
      const addButton = buttons[1];
      expect(addButton.disabled).toBe(false);
    });

    it('should render empty select options when no bookshelves available', () => {
      userBookshelvesSignal.set(null);
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('#bookshelfSelect');
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(1);
    });
  });

  describe('Dialog component integration', () => {
    it('should pass correct title to dialog', () => {
      expect(component.dialogTitle).toBe('Select a Bookshelf');
    });

    it('should pass isOpen signal to dialog', () => {
      expect(component.isDialogOpen()).toBe(false);

      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();
      expect(component.isDialogOpen()).toBe(true);
    });
  });
});
