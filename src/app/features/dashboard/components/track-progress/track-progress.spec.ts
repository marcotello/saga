import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DebugElement, reflectComponentType, ChangeDetectionStrategy } from '@angular/core';
import { TrackProgress } from './track-progress';
import { UserBook } from '../../../../core/models/user-book';

describe('TrackProgress', () => {
  let component: TrackProgress;
  let fixture: ComponentFixture<TrackProgress>;
  let compiled: HTMLElement;

  const mockBooks: UserBook[] = [
    {
      id: 1,
      name: 'Angular Up & Running',
      author: 'Shyam Seshadri',
      coverImage: '/images/books/angular-up-and-running.jpg',
      progressPercentage: 45,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      userId: 1,
      genreId: 1,
      status: 'reading',
      shelves: [1, 2]
    },
    {
      id: 2,
      name: 'Pro Angular',
      author: 'Adam Freeman',
      coverImage: '/images/books/pro-angular.jpg',
      progressPercentage: 75,
      createdAt: '2024-02-01',
      updatedAt: '2024-02-20',
      userId: 1,
      genreId: 1,
      status: 'reading',
      shelves: [1]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackProgress],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackProgress);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty books input', () => {
    expect(component.books()).toEqual([]);
  });

  it('should accept books input', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    expect(component.books()).toEqual(mockBooks);
  });

  it('should display book cards when books are provided', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    const bookCards = compiled.querySelectorAll('.book-card:not(.add-book-card)');
    expect(bookCards.length).toBe(2);
  });

  it('should display book titles correctly', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    const bookTitles = compiled.querySelectorAll('.book-title');
    expect(bookTitles[0].textContent?.trim()).toBe('Angular Up & Running');
    expect(bookTitles[1].textContent?.trim()).toBe('Pro Angular');
  });

  it('should display progress percentage correctly', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    const progressTexts = compiled.querySelectorAll('.progress-text');
    expect(progressTexts[0].textContent?.trim()).toBe('45%');
    expect(progressTexts[1].textContent?.trim()).toBe('75%');
  });

  it('should set progress bar values correctly', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    const progressBars = compiled.querySelectorAll('.progress-bar') as NodeListOf<HTMLProgressElement>;
    expect(progressBars[0].value).toBe(45);
    expect(progressBars[1].value).toBe(75);
  });

  it('should display book cover images', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    const images = compiled.querySelectorAll('.book-cover img') as NodeListOf<HTMLImageElement>;
    expect(images[0].src).toContain('/images/books/angular-up-and-running.jpg');
    expect(images[1].src).toContain('/images/books/pro-angular.jpg');
  });

  it('should emit updateProgress event when Update Progress button is clicked', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    spyOn(component.updateProgress, 'emit');

    const updateButtons = compiled.querySelectorAll('.update-progress-btn');
    (updateButtons[0] as HTMLButtonElement).click();

    expect(component.updateProgress.emit).toHaveBeenCalledWith(mockBooks[0]);
  });

  it('should emit updateProgress for correct book when multiple books exist', () => {
    fixture.componentRef.setInput('books', mockBooks);
    fixture.detectChanges();

    spyOn(component.updateProgress, 'emit');

    const updateButtons = compiled.querySelectorAll('.update-progress-btn');
    (updateButtons[1] as HTMLButtonElement).click();

    expect(component.updateProgress.emit).toHaveBeenCalledWith(mockBooks[1]);
  });

  it('should display Add Book card', () => {
    fixture.detectChanges();

    const addBookCard = compiled.querySelector('.add-book-card');
    expect(addBookCard).toBeTruthy();
  });

  it('should emit addBook event when Add a Book button is clicked', () => {
    fixture.detectChanges();

    spyOn(component.addBook, 'emit');

    const addButton = compiled.querySelector('.add-book-card button') as HTMLButtonElement;
    addButton.click();

    expect(component.addBook.emit).toHaveBeenCalled();
  });

  it('should display section title "My Books"', () => {
    fixture.detectChanges();

    const title = compiled.querySelector('h1');
    expect(title?.textContent).toBe('My Books');
  });

  it('should handle null books input', () => {
    fixture.componentRef.setInput('books', null);
    fixture.detectChanges();

    const bookCards = compiled.querySelectorAll('.book-card:not(.add-book-card)');
    expect(bookCards.length).toBe(0);
  });

  it('should handle empty books array', () => {
    fixture.componentRef.setInput('books', []);
    fixture.detectChanges();

    const bookCards = compiled.querySelectorAll('.book-card:not(.add-book-card)');
    expect(bookCards.length).toBe(0);
  });

  it('should display add book card even when no books exist', () => {
    fixture.componentRef.setInput('books', []);
    fixture.detectChanges();

    const addBookCard = compiled.querySelector('.add-book-card');
    expect(addBookCard).toBeTruthy();
  });


});
