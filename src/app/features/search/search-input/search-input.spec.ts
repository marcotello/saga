import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  let component: SearchInput;
  let fixture: ComponentFixture<SearchInput>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
      providers: [
        provideRouter([
          { path: 'search-results', component: {} as any }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInput);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render a search input', () => {
      const input = fixture.nativeElement.querySelector('input[type="search"]');
      expect(input).toBeTruthy();
    });

    it('should have correct placeholder text', () => {
      const input = fixture.nativeElement.querySelector('input[type="search"]');
      expect(input.getAttribute('placeholder')).toBe('Search Books...');
    });

    it('should have the search-input class', () => {
      const input = fixture.nativeElement.querySelector('input.search-input');
      expect(input).toBeTruthy();
    });
  });

  describe('onSearch', () => {
    it('should navigate to search-results with query param on valid input', () => {
      const event = { target: { value: 'angular' } } as unknown as Event;

      component.onSearch(event);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/search-results'],
        { queryParams: { q: 'angular' } }
      );
    });

    it('should trim the query before navigating', () => {
      const event = { target: { value: '  angular  ' } } as unknown as Event;

      component.onSearch(event);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/search-results'],
        { queryParams: { q: 'angular' } }
      );
    });

    it('should not navigate when input is empty', () => {
      const event = { target: { value: '' } } as unknown as Event;

      component.onSearch(event);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when input is only whitespace', () => {
      const event = { target: { value: '   ' } } as unknown as Event;

      component.onSearch(event);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate with the exact query value', () => {
      const event = { target: { value: 'Pro Angular' } } as unknown as Event;

      component.onSearch(event);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/search-results'],
        { queryParams: { q: 'Pro Angular' } }
      );
    });
  });

  describe('keyboard interaction', () => {
    it('should trigger search on Enter keypress', () => {
      const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
      input.value = 'angular';

      const event = new KeyboardEvent('keyup', { key: 'Enter' });
      input.dispatchEvent(event);
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/search-results'],
        { queryParams: { q: 'angular' } }
      );
    });

    it('should not trigger search on non-Enter keypress', () => {
      const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
      input.value = 'angular';

      const event = new KeyboardEvent('keyup', { key: 'a' });
      input.dispatchEvent(event);
      fixture.detectChanges();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
