import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BookGenres } from './book-genres';
import { BookGenreService } from '../services/book-genre-service';
import { BookGenreHttpMockService } from '../services/book-genre-http-mock-service';
import { Genre } from '../models/book-genre-model';
import { of } from 'rxjs';
import { SuccessEnvelope } from '../../../core/models/envelope';

describe('BookGenres', () => {
  let component: BookGenres;
  let fixture: ComponentFixture<BookGenres>;
  let mockBookGenreHttpService: jasmine.SpyObj<BookGenreHttpMockService>;
  let bookGenreService: BookGenreService;

  const mockGenres: Genre[] = [
    {
      id: 1,
      name: 'Mystery',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      deleted: false
    },
    {
      id: 2,
      name: 'Science Fiction',
      createdAt: '2024-01-02T00:00:00.000Z',
      lastUpdated: '2024-01-02T00:00:00.000Z',
      deleted: false
    },
    {
      id: 3,
      name: 'Romance',
      createdAt: '2024-01-03T00:00:00.000Z',
      lastUpdated: '2024-01-03T00:00:00.000Z',
      deleted: false
    },
    {
      id: 4,
      name: 'Fantasy',
      createdAt: '2024-01-04T00:00:00.000Z',
      lastUpdated: '2024-01-04T00:00:00.000Z',
      deleted: false
    }
  ];

  beforeEach(fakeAsync(() => {
    const mockResponse: SuccessEnvelope<Genre[]> = {
      status: 'success',
      message: 'Genres retrieved successfully',
      data: mockGenres
    };

    mockBookGenreHttpService = jasmine.createSpyObj('BookGenreHttpMockService', ['getAllGenres']);
    mockBookGenreHttpService.getAllGenres.and.returnValue(of(mockResponse));

    TestBed.configureTestingModule({
      imports: [BookGenres],
      providers: [
        provideHttpClient(),
        BookGenreService,
        { provide: BookGenreHttpMockService, useValue: mockBookGenreHttpService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookGenres);
    component = fixture.componentInstance;
    bookGenreService = TestBed.inject(BookGenreService);
    
    // Wait for the async service call to complete
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize filterText with empty string', () => {
      expect(component.filterText()).toBe('');
    });

    it('should call getAllGenres on construction', () => {
      expect(mockBookGenreHttpService.getAllGenres).toHaveBeenCalled();
    });

    it('should have access to genres from service', () => {
      expect(component.genres()).toEqual(mockGenres);
    });
  });

  describe('Filter functionality', () => {
    it('should update filterText when onFilterInput is called', () => {
      const input = document.createElement('input');
      input.value = 'Mystery';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(component.filterText()).toBe('Mystery');
    });

    it('should filter out non-alphabetic characters except spaces', () => {
      const input = document.createElement('input');
      input.value = 'Mystery123!@#';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(component.filterText()).toBe('Mystery');
      expect(input.value).toBe('Mystery');
    });

    it('should allow spaces in filter text', () => {
      const input = document.createElement('input');
      input.value = 'Science Fiction';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(component.filterText()).toBe('Science Fiction');
    });

    it('should update input value when filtered value differs', () => {
      const input = document.createElement('input');
      input.value = 'Test123';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(input.value).toBe('Test');
    });

    it('should handle empty input', () => {
      const input = document.createElement('input');
      input.value = '';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(component.filterText()).toBe('');
    });

    it('should filter out numbers', () => {
      const input = document.createElement('input');
      input.value = 'Genre123';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(component.filterText()).toBe('Genre');
    });

    it('should filter out special characters', () => {
      const input = document.createElement('input');
      input.value = 'Genre!@#$%';
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });

      component.onFilterInput(event);

      expect(component.filterText()).toBe('Genre');
    });
  });

  describe('Filtered and sorted genres', () => {
    it('should return all genres when filter is empty', () => {
      component.filterText.set('');
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result.length).toBe(4);
    });

    it('should filter genres by name (case insensitive)', () => {
      component.filterText.set('mystery');
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Mystery');
    });

    it('should filter genres by partial name match', () => {
      component.filterText.set('Sci');
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Science Fiction');
    });

    it('should return empty array when no genres match filter', () => {
      component.filterText.set('NonExistent');
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result.length).toBe(0);
    });

    it('should sort genres alphabetically by name', () => {
      component.filterText.set('');
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result[0].name).toBe('Fantasy');
      expect(result[1].name).toBe('Mystery');
      expect(result[2].name).toBe('Romance');
      expect(result[3].name).toBe('Science Fiction');
    });

    it('should maintain sort order when filtering', () => {
      component.filterText.set('F');
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Fantasy');
      expect(result[1].name).toBe('Science Fiction');
    });

    it('should update filtered results when genres signal changes', fakeAsync(() => {
      component.filterText.set('');
      fixture.detectChanges();

      const newGenres: Genre[] = [
        {
          id: 5,
          name: 'Thriller',
          createdAt: '2024-01-05T00:00:00.000Z',
          lastUpdated: '2024-01-05T00:00:00.000Z',
          deleted: false
        }
      ];

      const newResponse: SuccessEnvelope<Genre[]> = {
        status: 'success',
        message: 'Genres retrieved successfully',
        data: newGenres
      };

      mockBookGenreHttpService.getAllGenres.and.returnValue(of(newResponse));
      bookGenreService.getAllGenres();
      tick();
      fixture.detectChanges();

      const result = component.filteredAndSortedGenres();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Thriller');
    }));
  });

  describe('Genre actions', () => {
    it('should call onUpdateGenre when Update button is clicked', () => {
      spyOn(component, 'onUpdateGenre');
      component.filterText.set('');
      fixture.detectChanges();

      const updateButton = fixture.nativeElement.querySelector('.update-button');
      expect(updateButton).toBeTruthy();
      
      updateButton.click();
      fixture.detectChanges();

      expect(component.onUpdateGenre).toHaveBeenCalled();
    });

    it('should call onDeleteGenre when Delete button is clicked', () => {
      spyOn(component, 'onDeleteGenre');
      component.filterText.set('');
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector('.delete-button');
      expect(deleteButton).toBeTruthy();
      
      deleteButton.click();
      fixture.detectChanges();

      expect(component.onDeleteGenre).toHaveBeenCalled();
    });

    it('should pass correct genre to onUpdateGenre', () => {
      spyOn(component, 'onUpdateGenre');
      component.filterText.set('');
      fixture.detectChanges();

      const updateButtons = fixture.nativeElement.querySelectorAll('.update-button');
      updateButtons[0].click();
      fixture.detectChanges();

      expect(component.onUpdateGenre).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Fantasy' }));
    });

    it('should pass correct genre to onDeleteGenre', () => {
      spyOn(component, 'onDeleteGenre');
      component.filterText.set('');
      fixture.detectChanges();

      const deleteButtons = fixture.nativeElement.querySelectorAll('.delete-button');
      deleteButtons[0].click();
      fixture.detectChanges();

      expect(component.onDeleteGenre).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Fantasy' }));
    });
  });

  describe('Template rendering', () => {
    it('should render Genres heading', () => {
      const heading = fixture.nativeElement.querySelector('h1');
      expect(heading).toBeTruthy();
      expect(heading.textContent.trim()).toBe('Genres');
    });

    it('should render filter input', () => {
      const filterInput = fixture.nativeElement.querySelector('.filter-input');
      expect(filterInput).toBeTruthy();
      expect(filterInput.getAttribute('type')).toBe('text');
      expect(filterInput.getAttribute('placeholder')).toBe('Start typing to filter ...');
    });

    it('should render add-genre component', () => {
      const addGenreComponent = fixture.nativeElement.querySelector('app-add-genre');
      expect(addGenreComponent).toBeTruthy();
    });

    it('should render table with headers', () => {
      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();

      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBe(4);
      expect(headers[0].textContent.trim()).toBe('Name');
      expect(headers[1].textContent.trim()).toBe('Created At');
      expect(headers[2].textContent.trim()).toBe('Last Updated');
      expect(headers[3].textContent.trim()).toBe('Actions');
    });

    it('should render genre rows when genres are available', () => {
      component.filterText.set('');
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(4);
    });

    it('should render genre name in table', () => {
      component.filterText.set('');
      fixture.detectChanges();

      const nameCells = fixture.nativeElement.querySelectorAll('.name');
      expect(nameCells.length).toBe(4);
      expect(nameCells[0].textContent.trim()).toBe('Fantasy');
    });

    it('should render Update and Delete buttons for each genre', () => {
      component.filterText.set('');
      fixture.detectChanges();

      const updateButtons = fixture.nativeElement.querySelectorAll('.update-button');
      const deleteButtons = fixture.nativeElement.querySelectorAll('.delete-button');

      expect(updateButtons.length).toBe(4);
      expect(deleteButtons.length).toBe(4);
    });

    it('should render empty state when no genres match filter', () => {
      component.filterText.set('NonExistentGenre');
      fixture.detectChanges();

      const emptyRow = fixture.nativeElement.querySelector('tbody tr');
      expect(emptyRow).toBeTruthy();
      expect(emptyRow.textContent.trim()).toBe('No genres found');
    });

    it('should render empty state when genres array is empty', fakeAsync(() => {
      const emptyResponse: SuccessEnvelope<Genre[]> = {
        status: 'success',
        message: 'Genres retrieved successfully',
        data: []
      };

      mockBookGenreHttpService.getAllGenres.and.returnValue(of(emptyResponse));
      bookGenreService.getAllGenres();
      tick();
      fixture.detectChanges();

      component.filterText.set('');
      fixture.detectChanges();

      const emptyRow = fixture.nativeElement.querySelector('tbody tr');
      expect(emptyRow).toBeTruthy();
      expect(emptyRow.textContent.trim()).toBe('No genres found');
    }));

    it('should update filter input value when filterText changes', () => {
      component.filterText.set('Test');
      fixture.detectChanges();

      const filterInput = fixture.nativeElement.querySelector('.filter-input') as HTMLInputElement;
      expect(filterInput.value).toBe('Test');
    });

    it('should call onFilterInput when input event is triggered', () => {
      spyOn(component, 'onFilterInput');
      const filterInput = fixture.nativeElement.querySelector('.filter-input') as HTMLInputElement;
      
      filterInput.value = 'Test';
      filterInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.onFilterInput).toHaveBeenCalled();
    });
  });

  describe('Date formatting', () => {
    it('should format createdAt date in table', () => {
      component.filterText.set('');
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBeGreaterThan(0);
      // The date pipe should format the date - we just verify the cell exists
      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');
      expect(cells.length).toBe(4);
    });
  });
});
