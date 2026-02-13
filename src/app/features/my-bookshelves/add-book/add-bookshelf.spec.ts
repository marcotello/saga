import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AddBookshelf } from './add-bookshelf';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { BookshelvesHttpMockService } from '../../../core/mock-api/mock-http-services/bookshelves-http-mock-service';

describe('AddBookshelf', () => {
    let component: AddBookshelf;
    let fixture: ComponentFixture<AddBookshelf>;
    let mockBookshelvesHttpService: jasmine.SpyObj<BookshelvesHttpMockService>;
    let bookshelfService: BookshelfService;

    beforeEach(async () => {
        mockBookshelvesHttpService = jasmine.createSpyObj('BookshelvesHttpMockService', ['addBookshelf']);

        await TestBed.configureTestingModule({
            imports: [AddBookshelf],
            providers: [
                provideHttpClient(),
                BookshelfService,
                { provide: BookshelvesHttpMockService, useValue: mockBookshelvesHttpService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddBookshelf);
        component = fixture.componentInstance;
        bookshelfService = TestBed.inject(BookshelfService);
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
            expect(component.dialogTitle).toBe('Add Bookshelf');
        });

        it('should initialize form with empty name', () => {
            expect(component.bookshelfForm.get('name')?.value).toBe('');
        });

        it('should initialize form with empty image', () => {
            expect(component.bookshelfForm.get('image')?.value).toBe('');
        });

        it('should have name control with required validator', () => {
            const nameControl = component.bookshelfForm.get('name');
            expect(nameControl?.hasError('required')).toBe(true);
            expect(nameControl?.valid).toBe(false);
        });

        it('should have image control with required validator', () => {
            const imageControl = component.bookshelfForm.get('image');
            expect(imageControl?.hasError('required')).toBe(true);
            expect(imageControl?.valid).toBe(false);
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
            component.bookshelfForm.patchValue({ name: 'Test Shelf', image: '/images/test.svg' });
            expect(component.bookshelfForm.get('name')?.value).toBe('Test Shelf');

            component.closeDialog();
            expect(component.bookshelfForm.get('name')?.value).toBe('');
            expect(component.bookshelfForm.get('image')?.value).toBe('');
            expect(component.bookshelfForm.pristine).toBe(true);
        });
    });

    describe('Form validation', () => {
        it('should show name error when name is empty and touched', () => {
            const nameControl = component.bookshelfForm.get('name');
            nameControl?.markAsTouched();
            nameControl?.setValue('');

            fixture.detectChanges();
            expect(component.nameHasError()).toBe(true);
        });

        it('should show name error when name is empty and dirty', () => {
            const nameControl = component.bookshelfForm.get('name');
            nameControl?.markAsDirty();
            nameControl?.setValue('');

            fixture.detectChanges();
            expect(component.nameHasError()).toBe(true);
        });

        it('should not show name error when name is valid', () => {
            const nameControl = component.bookshelfForm.get('name');
            nameControl?.setValue('My Shelf');

            fixture.detectChanges();
            expect(component.nameHasError()).toBe(false);
        });

        it('should not show name error when name is empty but not touched or dirty', () => {
            const nameControl = component.bookshelfForm.get('name');
            nameControl?.setValue('');

            fixture.detectChanges();
            expect(component.nameHasError()).toBe(false);
        });

        it('should show image error when image is empty and touched', () => {
            const imageControl = component.bookshelfForm.get('image');
            imageControl?.markAsTouched();
            imageControl?.setValue('');

            fixture.detectChanges();
            expect(component.imageHasError()).toBe(true);
        });

        it('should show image error when image is empty and dirty', () => {
            const imageControl = component.bookshelfForm.get('image');
            imageControl?.markAsDirty();
            imageControl?.setValue('');

            fixture.detectChanges();
            expect(component.imageHasError()).toBe(true);
        });

        it('should not show image error when image is valid', () => {
            const imageControl = component.bookshelfForm.get('image');
            imageControl?.setValue('/images/test.svg');

            fixture.detectChanges();
            expect(component.imageHasError()).toBe(false);
        });

        it('should not show image error when image is empty but not touched or dirty', () => {
            const imageControl = component.bookshelfForm.get('image');
            imageControl?.setValue('');

            fixture.detectChanges();
            expect(component.imageHasError()).toBe(false);
        });

        it('should mark form as invalid when both fields are empty', () => {
            component.bookshelfForm.patchValue({ name: '', image: '' });
            expect(component.bookshelfForm.invalid).toBe(true);
        });

        it('should mark form as invalid when only name is filled', () => {
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '' });
            expect(component.bookshelfForm.invalid).toBe(true);
        });

        it('should mark form as invalid when only image is filled', () => {
            component.bookshelfForm.patchValue({ name: '', image: '/images/test.svg' });
            expect(component.bookshelfForm.invalid).toBe(true);
        });

        it('should mark form as valid when both fields have values', () => {
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '/images/test.svg' });
            expect(component.bookshelfForm.valid).toBe(true);
        });
    });

    describe('Form submission', () => {
        it('should not submit when form is invalid', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: '', image: '' });

            component.onSave();

            expect(mockBookshelvesHttpService.addBookshelf).not.toHaveBeenCalled();
        });

        it('should mark all fields as touched when form is invalid on submit', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: '', image: '' });

            component.onSave();

            expect(component.bookshelfForm.get('name')?.touched).toBe(true);
            expect(component.bookshelfForm.get('image')?.touched).toBe(true);
        });

        it('should not submit when name is only whitespace', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: '   ', image: '/images/test.svg' });

            component.onSave();

            expect(mockBookshelvesHttpService.addBookshelf).not.toHaveBeenCalled();
            expect(component.bookshelfForm.get('name')?.hasError('required')).toBe(true);
        });

        it('should not submit when image is only whitespace', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '   ' });

            component.onSave();

            expect(mockBookshelvesHttpService.addBookshelf).not.toHaveBeenCalled();
            expect(component.bookshelfForm.get('image')?.hasError('required')).toBe(true);
        });

        it('should call bookshelfService.addBookshelf with trimmed values when form is valid', () => {
            spyOn(bookshelfService, 'addBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: '  My Shelf  ', image: '  /images/test.svg  ' });

            component.onSave();

            expect(bookshelfService.addBookshelf).toHaveBeenCalledWith('My Shelf', '/images/test.svg', 1);
        });

        it('should close dialog after successful save', () => {
            spyOn(bookshelfService, 'addBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '/images/test.svg' });

            component.onSave();

            expect(component.requestClose.emit).toHaveBeenCalled();
        });

        it('should reset form after successful save', () => {
            spyOn(bookshelfService, 'addBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '/images/test.svg' });

            component.onSave();

            expect(component.bookshelfForm.get('name')?.value).toBe('');
            expect(component.bookshelfForm.get('image')?.value).toBe('');
            expect(component.bookshelfForm.pristine).toBe(true);
        });

        it('should handle service call with valid data', () => {
            spyOn(bookshelfService, 'addBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: 'Science Fiction', image: '/images/sci-fi.svg' });

            component.onSave();

            expect(bookshelfService.addBookshelf).toHaveBeenCalledWith('Science Fiction', '/images/sci-fi.svg', 1);
            expect(bookshelfService.addBookshelf).toHaveBeenCalledTimes(1);
        });
    });

    describe('Template rendering', () => {
        it('should render dialog when isDialogOpen is true', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const dialog = fixture.nativeElement.querySelector('app-dialog');
            expect(dialog).toBeTruthy();
        });

        it('should render form with bookshelf name input', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('#bookshelfName');
            expect(input).toBeTruthy();
            expect(input.getAttribute('type')).toBe('text');
            expect(input.getAttribute('formControlName')).toBe('name');
        });

        it('should render form with bookshelf image input', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('#bookshelfImage');
            expect(input).toBeTruthy();
            expect(input.getAttribute('type')).toBe('text');
            expect(input.getAttribute('formControlName')).toBe('image');
        });

        it('should render error message when name has error', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            const nameControl = component.bookshelfForm.get('name');
            nameControl?.markAsTouched();
            nameControl?.setValue('');
            fixture.detectChanges();

            const errorMessages = fixture.nativeElement.querySelectorAll('.dialog-error');
            expect(errorMessages.length).toBeGreaterThanOrEqual(1);
            expect(errorMessages[0].textContent.trim()).toBe('Bookshelf Name is required.');
        });

        it('should render error message when image has error', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            const imageControl = component.bookshelfForm.get('image');
            imageControl?.markAsTouched();
            imageControl?.setValue('');
            fixture.detectChanges();

            const errorMessages = fixture.nativeElement.querySelectorAll('.dialog-error');
            const imageError = Array.from(errorMessages).find(
                (el: any) => el.textContent.trim() === 'Icon is required.'
            );
            expect(imageError).toBeTruthy();
        });

        it('should not render error messages when form is valid', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '/images/test.svg' });
            fixture.detectChanges();

            const errorMessages = fixture.nativeElement.querySelectorAll('.dialog-error');
            expect(errorMessages.length).toBe(0);
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
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '/images/test.svg' });
            fixture.detectChanges();

            const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(saveButton.disabled).toBe(false);
        });

        it('should submit form when Save button is clicked', () => {
            spyOn(bookshelfService, 'addBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            component.bookshelfForm.patchValue({ name: 'My Shelf', image: '/images/test.svg' });
            fixture.detectChanges();

            const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
            saveButton.click();
            fixture.detectChanges();

            expect(bookshelfService.addBookshelf).toHaveBeenCalledWith('My Shelf', '/images/test.svg', 1);
        });
    });

    describe('Dialog component integration', () => {
        it('should pass correct title to dialog', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const dialog = fixture.nativeElement.querySelector('app-dialog');
            expect(dialog).toBeTruthy();
            expect(component.dialogTitle).toBe('Add Bookshelf');
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
