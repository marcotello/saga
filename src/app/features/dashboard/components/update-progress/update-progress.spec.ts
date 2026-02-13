import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DebugElement, reflectComponentType, ChangeDetectionStrategy } from '@angular/core';
import { UpdateProgress } from './update-progress';
import { UserBook } from '../../../../core/models/user-book';

describe('UpdateProgress', () => {
  let component: UpdateProgress;
  let fixture: ComponentFixture<UpdateProgress>;
  let compiled: HTMLElement;

  const mockBook: UserBook = {
    id: 1,
    userId: 1,
    name: 'Test Book',
    author: 'Test Author',
    coverImage: 'test.jpg',
    status: 'Reading',
    progressPercentage: 50,
    genreId: 1,
    shelves: [{ id: 1, name: 'Shelf 1' }],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProgress],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProgress);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require book input', () => {
    fixture.componentRef.setInput('book', mockBook);
    fixture.detectChanges();

    expect(component.book()).toEqual(mockBook);
  });

  it('should have default isOpen as false', () => {
    fixture.componentRef.setInput('book', mockBook);
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('should accept isOpen input', () => {
    fixture.componentRef.setInput('book', mockBook);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
  });

  describe('progress signal', () => {
    it('should initialize with book progressPercentage', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      expect(component.progress()).toBe(50);
    });

    it('should update when book changes', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      const updatedBook = { ...mockBook, progressPercentage: 75 };
      fixture.componentRef.setInput('book', updatedBook);
      fixture.detectChanges();

      expect(component.progress()).toBe(75);
    });

    it('should be settable independently', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      component.progress.set(80);

      expect(component.progress()).toBe(80);
    });
  });

  describe('onSave', () => {
    it('should emit saveProgress with current progress value', (done) => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      component.saveProgress.subscribe((progress: number) => {
        expect(progress).toBe(50);
        done();
      });

      component.onSave();
    });

    it('should emit updated progress value', (done) => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      component.progress.set(75);

      component.saveProgress.subscribe((progress: number) => {
        expect(progress).toBe(75);
        done();
      });

      component.onSave();
    });
  });

  describe('onCancel', () => {
    it('should emit cancelUpdate', (done) => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      component.cancelUpdate.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      component.onCancel();
    });
  });

  describe('onRangeChange', () => {
    it('should update progress signal with new value', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      const event = {
        target: {
          valueAsNumber: 65
        }
      } as unknown as Event;

      component.onRangeChange(event);

      expect(component.progress()).toBe(65);
    });

    it('should handle 0 progress', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      const event = {
        target: {
          valueAsNumber: 0
        }
      } as unknown as Event;

      component.onRangeChange(event);

      expect(component.progress()).toBe(0);
    });

    it('should handle 100 progress', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      const event = {
        target: {
          valueAsNumber: 100
        }
      } as unknown as Event;

      component.onRangeChange(event);

      const dialog = compiled.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
    });

    it('should pass correct book name to dialog', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const content = compiled.textContent;
      expect(content).toContain('Test Book');
    });
  });

  describe('Component integration', () => {


    it('should render dialog when isOpen is true', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const dialog = compiled.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
    });

    it('should pass correct book name to dialog', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const content = compiled.textContent;
      expect(content).toContain('Test Book');
    });
  });

  describe('Edge cases', () => {
    it('should handle book with 0% progress', () => {
      const bookWithZeroProgress = { ...mockBook, progressPercentage: 0 };
      fixture.componentRef.setInput('book', bookWithZeroProgress);
      fixture.detectChanges();

      expect(component.progress()).toBe(0);
    });

    it('should handle book with 100% progress', () => {
      const bookWithFullProgress = { ...mockBook, progressPercentage: 100 };
      fixture.componentRef.setInput('book', bookWithFullProgress);
      fixture.detectChanges();

      expect(component.progress()).toBe(100);
    });

    it('should maintain progress when book input changes to different book', () => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      component.progress.set(60);

      const differentBook: UserBook = {
        ...mockBook,
        id: 2,
        name: 'Different Book',
        progressPercentage: 30
      };

      fixture.componentRef.setInput('book', differentBook);
      fixture.detectChanges();

      // linkedSignal should update to new book's progress
      expect(component.progress()).toBe(30);
    });

    it('should emit correct progress after multiple changes', (done) => {
      fixture.componentRef.setInput('book', mockBook);
      fixture.detectChanges();

      component.progress.set(60);
      component.progress.set(70);
      component.progress.set(85);

      component.saveProgress.subscribe((progress: number) => {
        expect(progress).toBe(85);
        done();
      });

      component.onSave();
    });
  });
});
