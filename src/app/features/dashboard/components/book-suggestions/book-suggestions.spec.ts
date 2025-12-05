import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BookSuggestions, BookSuggestion } from './book-suggestions';

describe('BookSuggestions', () => {
  let component: BookSuggestions;
  let fixture: ComponentFixture<BookSuggestions>;
  let compiled: HTMLElement;

  const mockBookSuggestions: BookSuggestion[] = [
    {
      id: 1,
      name: 'Mastering Angular Signals',
      image: 'images/books/ng-book.jpg'
    },
    {
      id: 2,
      name: 'Ai Powered App Development',
      image: 'images/books/ng-book.jpg'
    },
    {
      id: 3,
      name: 'Effective Angular',
      image: 'images/books/ng-book.jpg'
    },
    {
      id: 4,
      name: 'Effective TypeScript',
      image: 'images/books/ng-book.jpg'
    },
    {
      id: 5,
      name: 'Angular for Enterprise Applications',
      image: 'images/books/ng-book.jpg'
    },
    {
      id: 6,
      name: 'Modern Angular',
      image: 'images/books/ng-book.jpg'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSuggestions]
    }).compileComponents();

    fixture = TestBed.createComponent(BookSuggestions);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require bookSuggestions input', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();
    
    expect(component.bookSuggestions()).toEqual(mockBookSuggestions);
  });

  it('should display book cards when bookSuggestions are provided', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    const bookCards = compiled.querySelectorAll('.book-card');
    expect(bookCards.length).toBe(6);
  });

  it('should display book names correctly', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    const bookNames = Array.from(compiled.querySelectorAll('.book-card .book-name'))
      .map(el => el.textContent?.trim());
    
    expect(bookNames).toEqual([
      'Mastering Angular Signals',
      'Ai Powered App Development',
      'Effective Angular',
      'Effective TypeScript',
      'Angular for Enterprise Applications',
      'Modern Angular'
    ]);
  });

  it('should display book images correctly', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    const images = compiled.querySelectorAll('.book-card img') as NodeListOf<HTMLImageElement>;
    images.forEach(img => {
      expect(img.src).toContain('images/books/ng-book.jpg');
    });
  });

  it('should display book image alt text correctly', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    const images = compiled.querySelectorAll('.book-card img') as NodeListOf<HTMLImageElement>;
    expect(images[0].alt).toBe('Mastering Angular Signals');
    expect(images[1].alt).toBe('Ai Powered App Development');
    expect(images[2].alt).toBe('Effective Angular');
  });

  it('should call onBookClick when book card is clicked', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    spyOn(component, 'onBookClick');

    const bookCards = compiled.querySelectorAll('.book-card');
    (bookCards[0] as HTMLElement).click();

    expect(component.onBookClick).toHaveBeenCalledWith(mockBookSuggestions[0]);
  });

  it('should emit bookClicked event when book card is clicked', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    spyOn(component.bookClicked, 'emit');

    const bookCards = compiled.querySelectorAll('.book-card');
    (bookCards[0] as HTMLElement).click();

    expect(component.bookClicked.emit).toHaveBeenCalledWith(mockBookSuggestions[0]);
  });

  it('should emit correct book when multiple books exist', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    spyOn(component.bookClicked, 'emit');

    const bookCards = compiled.querySelectorAll('.book-card');
    (bookCards[2] as HTMLElement).click();

    expect(component.bookClicked.emit).toHaveBeenCalledWith(mockBookSuggestions[2]);
  });

  it('should display section title "Your Next Read"', () => {
    fixture.componentRef.setInput('bookSuggestions', mockBookSuggestions);
    fixture.detectChanges();

    const title = compiled.querySelector('h1');
    expect(title?.textContent).toBe('Your Next Read');
  });

  it('should handle empty bookSuggestions array', () => {
    fixture.componentRef.setInput('bookSuggestions', []);
    fixture.detectChanges();

    const bookCards = compiled.querySelectorAll('.book-card');
    expect(bookCards.length).toBe(0);
  });

  it('should have OnPush change detection strategy', () => {
    const debugElement: DebugElement = fixture.debugElement;
    const changeDetectionStrategy = debugElement.componentInstance.constructor.ɵcmp.changeDetection;
    expect(changeDetectionStrategy).toBe(1); // 1 = OnPush
  });

  describe('onBookClick method', () => {
    it('should emit the provided book', () => {
      spyOn(component.bookClicked, 'emit');
      
      component.onBookClick(mockBookSuggestions[0]);
      
      expect(component.bookClicked.emit).toHaveBeenCalledWith(mockBookSuggestions[0]);
    });
  });
});
