import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SearchBookDialog } from './search-book-dialog';

describe('SearchBookDialog', () => {
  let component: SearchBookDialog;
  let fixture: ComponentFixture<SearchBookDialog>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SearchBookDialog],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBookDialog);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have dialogTitle set to "Search for a Book"', () => {
    expect(component.dialogTitle).toBe('Search for a Book');
  });

  it('should initialize searchQuery as empty string', () => {
    expect(component.searchQuery).toBe('');
  });

  describe('onSearch', () => {
    it('should navigate to search results with query param when search query is not empty', () => {
      component.searchQuery = 'The Great Gatsby';

      component.onSearch();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/search-results'],
        { queryParams: { q: 'The Great Gatsby' } }
      );
    });

    it('should not navigate when search query is empty', () => {
      component.searchQuery = '';

      component.onSearch();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when search query is only whitespace', () => {
      component.searchQuery = '   ';

      component.onSearch();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should trim search query before navigating', () => {
      component.searchQuery = '  The Great Gatsby  ';

      component.onSearch();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/search-results'],
        { queryParams: { q: 'The Great Gatsby' } }
      );
    });

    it('should emit requestClose after navigating', () => {
      spyOn(component.requestClose, 'emit');
      component.searchQuery = 'Test Book';

      component.onSearch();

      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should reset searchQuery after navigating', () => {
      component.searchQuery = 'Test Book';

      component.onSearch();

      expect(component.searchQuery).toBe('');
    });
  });

  describe('closeDialog', () => {
    it('should emit requestClose', () => {
      spyOn(component.requestClose, 'emit');

      component.closeDialog();

      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should reset searchQuery', () => {
      component.searchQuery = 'Some text';

      component.closeDialog();

      expect(component.searchQuery).toBe('');
    });
  });
});
