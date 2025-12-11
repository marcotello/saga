import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AddGenre } from './add-genre';
import { BookGenreService } from '../services/book-genre-service';
import { BookGenreHttpMockService } from '../../../core/mock-api/mock-http-services/book-genre-http-mock-service';

describe('AddGenre', () => {
  let component: AddGenre;
  let fixture: ComponentFixture<AddGenre>;
  let mockBookGenreHttpService: jasmine.SpyObj<BookGenreHttpMockService>;
  let bookGenreService: BookGenreService;

  beforeEach(async () => {
    mockBookGenreHttpService = jasmine.createSpyObj('BookGenreHttpMockService', ['addGenre']);

    await TestBed.configureTestingModule({
      imports: [AddGenre],
      providers: [
        provideHttpClient(),
        BookGenreService,
        { provide: BookGenreHttpMockService, useValue: mockBookGenreHttpService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddGenre);
    component = fixture.componentInstance;
    bookGenreService = TestBed.inject(BookGenreService);
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
      expect(component.dialogTitle).toBe('Add Genre');
    });

    it('should initialize form with empty name', () => {
      expect(component.genreForm.get('name')?.value).toBe('');
    });

    it('should have name control with required and minLength validators', () => {
      const nameControl = component.genreForm.get('name');
      expect(nameControl?.hasError('required')).toBe(true);
      expect(nameControl?.valid).toBe(false);
    });
  });

  describe('Dialog management', () => {
    it('should close dialog when closeDialog is called', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      component.closeDialog();
      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should reset form when dialog is closed', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      component.genreForm.patchValue({ name: 'Test Genre' });
      expect(component.genreForm.get('name')?.value).toBe('Test Genre');

      component.closeDialog();
      expect(component.genreForm.get('name')?.value).toBe('');
      expect(component.genreForm.pristine).toBe(true);
    });
  });

  describe('Form validation', () => {
    it('should show error when name is empty and touched', () => {
      const nameControl = component.genreForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      fixture.detectChanges();
      expect(component.nameHasError()).toBe(true);
    });

    it('should show error when name is empty and dirty', () => {
      const nameControl = component.genreForm.get('name');
      nameControl?.markAsDirty();
      nameControl?.setValue('');

      fixture.detectChanges();
      expect(component.nameHasError()).toBe(true);
    });

    it('should not show error when name is valid', () => {
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');

      fixture.detectChanges();
      expect(component.nameHasError()).toBe(false);
    });

    it('should not show error when name is empty but not touched or dirty', () => {
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('');

      fixture.detectChanges();
      expect(component.nameHasError()).toBe(false);
    });

    it('should mark form as invalid when name is empty', () => {
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('');
      expect(component.genreForm.invalid).toBe(true);
    });

    it('should mark form as valid when name has value', () => {
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');
      expect(component.genreForm.valid).toBe(true);
    });
  });

  describe('Form submission', () => {

    it('should not submit when form is invalid', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('');

      component.onSave();

      expect(mockBookGenreHttpService.addGenre).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid on submit', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('');

      component.onSave();

      expect(nameControl?.touched).toBe(true);
    });

    it('should not submit when name is only whitespace', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('   ');

      component.onSave();

      expect(mockBookGenreHttpService.addGenre).not.toHaveBeenCalled();
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should call bookGenreService.addGenre with trimmed name when form is valid', () => {
      spyOn(bookGenreService, 'addGenre');
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('  Mystery  ');

      component.onSave();

      expect(bookGenreService.addGenre).toHaveBeenCalledWith('Mystery');
    });

    it('should close dialog after successful save', () => {
      spyOn(bookGenreService, 'addGenre');
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');

      component.onSave();

      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should reset form after successful save', () => {
      spyOn(bookGenreService, 'addGenre');
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');

      component.onSave();

      expect(nameControl?.value).toBe('');
      expect(component.genreForm.pristine).toBe(true);
    });

    it('should handle service call with valid genre name', () => {
      spyOn(bookGenreService, 'addGenre');
      fixture.componentRef.setInput('isDialogOpen', true);
      component.genreForm.patchValue({ name: 'Science Fiction' });

      component.onSave();

      expect(bookGenreService.addGenre).toHaveBeenCalledWith('Science Fiction');
      expect(bookGenreService.addGenre).toHaveBeenCalledTimes(1);
    });
  });

  describe('Template rendering', () => {
    it('should render dialog when isDialogOpen is true', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
    });

    it('should render form with genre name input', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('#genreName');
      expect(input).toBeTruthy();
      expect(input.getAttribute('type')).toBe('text');
      expect(input.getAttribute('formControlName')).toBe('name');
    });

    it('should render error message when name has error', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('.dialog-error');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent.trim()).toBe('Name is required.');
    });

    it('should not render error message when name is valid', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('.dialog-error');
      expect(errorMessage).toBeFalsy();
    });

    it('should render Cancel button', () => {
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

    it('should render Save button', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveButton).toBeTruthy();
      expect(saveButton.textContent.trim()).toBe('Save');
    });

    it('should disable Save button when form is invalid', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveButton.disabled).toBe(true);
    });

    it('should enable Save button when form is valid', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveButton.disabled).toBe(false);
    });

    it('should submit form when Save button is clicked', () => {
      spyOn(bookGenreService, 'addGenre');
      fixture.componentRef.setInput('isDialogOpen', true);
      const nameControl = component.genreForm.get('name');
      nameControl?.setValue('Mystery');
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      saveButton.click();
      fixture.detectChanges();

      expect(bookGenreService.addGenre).toHaveBeenCalledWith('Mystery');
    });
  });

  describe('Dialog component integration', () => {
    it('should pass correct title to dialog', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
      // The dialog component receives the title via input signal
      expect(component.dialogTitle).toBe('Add Genre');
    });

    it('should pass isOpen signal to dialog', () => {
      expect(component.isDialogOpen()).toBe(false);

      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();
      expect(component.isDialogOpen()).toBe(true);
    });

    it('should close dialog when requestClose event is emitted', () => {
      fixture.componentRef.setInput('isDialogOpen', true);
      fixture.detectChanges();

      component.closeDialog();
      fixture.detectChanges();
      expect(component.requestClose.emit).toHaveBeenCalled();
    });
  });
});

