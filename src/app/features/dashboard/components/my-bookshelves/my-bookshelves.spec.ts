import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, reflectComponentType, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MyBookshelves } from './my-bookshelves';
import { Bookshelf } from '../../../../core/models/bookshelf';

describe('MyBookshelves', () => {
  let component: MyBookshelves;
  let fixture: ComponentFixture<MyBookshelves>;
  let compiled: HTMLElement;

  const mockBookshelves: Bookshelf[] = [
    {
      id: 1,
      name: 'Tech',
      image: '/images/bookshelves/tech.svg',
      userId: 1
    },
    {
      id: 2,
      name: 'Fiction',
      image: '/images/bookshelves/fiction.svg',
      userId: 1
    },
    {
      id: 3,
      name: 'Business',
      image: '/images/bookshelves/business.svg',
      userId: 1
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookshelves]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookshelves);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require bookshelves input', () => {
    // The component has a required input, so we need to set it before detectChanges
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    expect(component.bookshelves()).toEqual(mockBookshelves);
  });

  it('should display shelf cards when bookshelves are provided', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const shelfCards = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card)');
    expect(shelfCards.length).toBe(3);
  });

  it('should display shelf names correctly', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const shelfNames = Array.from(compiled.querySelectorAll('.shelf-card:not(.add-shelf-card) .shelf-name'))
      .map(el => el.textContent?.trim());

    expect(shelfNames).toEqual(['Tech', 'Fiction', 'Business']);
  });

  it('should display shelf images correctly', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const images = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card) img') as NodeListOf<HTMLImageElement>;
    expect(images[0].src).toContain('/images/bookshelves/tech.svg');
    expect(images[1].src).toContain('/images/bookshelves/fiction.svg');
    expect(images[2].src).toContain('/images/bookshelves/business.svg');
  });

  it('should display shelf image alt text correctly', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const images = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card) img') as NodeListOf<HTMLImageElement>;
    expect(images[0].alt).toBe('Tech');
    expect(images[1].alt).toBe('Fiction');
    expect(images[2].alt).toBe('Business');
  });

  it('should call onShelfClick when shelf card is clicked', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    spyOn(component, 'onShelfClick');

    const shelfCards = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card)');
    (shelfCards[0] as HTMLElement).click();

    expect(component.onShelfClick).toHaveBeenCalledWith(mockBookshelves[0]);
  });

  it('should emit bookshelfClicked event when shelf card is clicked', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    spyOn(component.bookshelfClicked, 'emit');

    const shelfCards = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card)');
    (shelfCards[0] as HTMLElement).click();

    expect(component.bookshelfClicked.emit).toHaveBeenCalledWith(mockBookshelves[0]);
  });

  it('should emit correct bookshelf when multiple shelves exist', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    spyOn(component.bookshelfClicked, 'emit');

    const shelfCards = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card)');
    (shelfCards[1] as HTMLElement).click();

    expect(component.bookshelfClicked.emit).toHaveBeenCalledWith(mockBookshelves[1]);
  });

  it('should display Add Shelf card', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const addShelfCard = compiled.querySelector('.add-shelf-card');
    expect(addShelfCard).toBeTruthy();
  });

  it('should display "Add Shelf" text on add card', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const addShelfCard = compiled.querySelector('.add-shelf-card .shelf-name');
    expect(addShelfCard?.textContent).toBe('Add Shelf');
  });

  it('should call onAddShelfClick when add shelf card is clicked', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    spyOn(component, 'onAddShelfClick');

    const addShelfCard = compiled.querySelector('.add-shelf-card') as HTMLElement;
    addShelfCard.click();

    expect(component.onAddShelfClick).toHaveBeenCalled();
  });

  it('should emit addBookshelfClicked event when add shelf card is clicked', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    spyOn(component.addBookshelfClicked, 'emit');

    const addShelfCard = compiled.querySelector('.add-shelf-card') as HTMLElement;
    addShelfCard.click();

    expect(component.addBookshelfClicked.emit).toHaveBeenCalled();
  });

  it('should display section title "My Bookshelves"', () => {
    fixture.componentRef.setInput('bookshelves', mockBookshelves);
    fixture.detectChanges();

    const title = compiled.querySelector('h1');
    expect(title?.textContent).toBe('My Bookshelves');
  });

  it('should handle null bookshelves input', () => {
    fixture.componentRef.setInput('bookshelves', null);
    fixture.detectChanges();

    const shelfCards = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card)');
    expect(shelfCards.length).toBe(0);
  });

  it('should handle empty bookshelves array', () => {
    fixture.componentRef.setInput('bookshelves', []);
    fixture.detectChanges();

    const shelfCards = compiled.querySelectorAll('.shelf-card:not(.add-shelf-card)');
    expect(shelfCards.length).toBe(0);
  });

  it('should display add shelf card even when no bookshelves exist', () => {
    fixture.componentRef.setInput('bookshelves', []);
    fixture.detectChanges();

    const addShelfCard = compiled.querySelector('.add-shelf-card');
    expect(addShelfCard).toBeTruthy();
  });



  describe('onShelfClick method', () => {
    it('should emit the provided bookshelf', () => {
      spyOn(component.bookshelfClicked, 'emit');

      component.onShelfClick(mockBookshelves[0]);

      expect(component.bookshelfClicked.emit).toHaveBeenCalledWith(mockBookshelves[0]);
    });
  });

  describe('onAddShelfClick method', () => {
    it('should emit addBookshelfClicked event', () => {
      spyOn(component.addBookshelfClicked, 'emit');

      component.onAddShelfClick();

      expect(component.addBookshelfClicked.emit).toHaveBeenCalled();
    });
  });
});
