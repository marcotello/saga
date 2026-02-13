import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { UpdateBookshelf } from './update-bookshelf';
import { BookshelfService } from '../../../core/services/bookshelf-service';
import { BookshelvesHttpMockService } from '../../../core/mock-api/mock-http-services/bookshelves-http-mock-service';
import { Bookshelf } from '../../../core/models/bookshelf';

describe('UpdateBookshelf', () => {
    let component: UpdateBookshelf;
    let fixture: ComponentFixture<UpdateBookshelf>;
    let mockBookshelvesHttpService: jasmine.SpyObj<BookshelvesHttpMockService>;
    let bookshelfService: BookshelfService;

    const mockBookshelf: Bookshelf = {
        id: 1,
        name: 'Fiction',
        image: '/images/fiction.svg',
        userId: 1
    };

    beforeEach(async () => {
        mockBookshelvesHttpService = jasmine.createSpyObj('BookshelvesHttpMockService', ['updateBookshelf']);

        await TestBed.configureTestingModule({
            imports: [UpdateBookshelf],
            providers: [
                provideHttpClient(),
                BookshelfService,
                { provide: BookshelvesHttpMockService, useValue: mockBookshelvesHttpService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateBookshelf);
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
            expect(component.dialogTitle).toBe('Update Bookshelf');
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

        it('should initialize with null bookshelf', () => {
            expect(component.bookshelf()).toBeNull();
        });
    });

    describe('Bookshelf input effect', () => {
        it('should populate form when dialog opens with bookshelf set', fakeAsync(() => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            fixture.detectChanges();
            tick();

            expect(component.bookshelfForm.get('name')?.value).toBe('Fiction');
            expect(component.bookshelfForm.get('image')?.value).toBe('/images/fiction.svg');
        }));

        it('should update form when bookshelf input changes', fakeAsync(() => {
            const shelf1: Bookshelf = { ...mockBookshelf, name: 'Fiction', image: '/images/fiction.svg' };
            const shelf2: Bookshelf = { ...mockBookshelf, id: 2, name: 'Non-Fiction', image: '/images/nonfiction.svg' };

            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', shelf1);
            fixture.detectChanges();
            tick();

            expect(component.bookshelfForm.get('name')?.value).toBe('Fiction');
            expect(component.bookshelfForm.get('image')?.value).toBe('/images/fiction.svg');

            fixture.componentRef.setInput('bookshelf', shelf2);
            fixture.detectChanges();
            tick();

            expect(component.bookshelfForm.get('name')?.value).toBe('Non-Fiction');
            expect(component.bookshelfForm.get('image')?.value).toBe('/images/nonfiction.svg');
        }));

        it('should not update form when bookshelf is null', fakeAsync(() => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            fixture.detectChanges();
            tick();

            expect(component.bookshelfForm.get('name')?.value).toBe('Fiction');

            fixture.componentRef.setInput('bookshelf', null);
            fixture.detectChanges();
            tick();

            // Form should still have the previous value when bookshelf is null
            expect(component.bookshelfForm.get('name')?.value).toBe('Fiction');
        }));
    });

    describe('Dialog management', () => {
        it('should close dialog when closeDialog is called', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            component.closeDialog();
            expect(component.requestClose.emit).toHaveBeenCalledWith(null);
        });

        it('should reset form when dialog is closed', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            fixture.detectChanges();

            expect(component.bookshelfForm.get('name')?.value).toBe('Fiction');

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
            nameControl?.setValue('Fiction');

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

        it('should not show image error when image is valid', () => {
            const imageControl = component.bookshelfForm.get('image');
            imageControl?.setValue('/images/test.svg');

            fixture.detectChanges();
            expect(component.imageHasError()).toBe(false);
        });

        it('should mark form as invalid when both fields are empty', () => {
            component.bookshelfForm.patchValue({ name: '', image: '' });
            expect(component.bookshelfForm.invalid).toBe(true);
        });

        it('should mark form as valid when both fields have values', () => {
            component.bookshelfForm.patchValue({ name: 'Fiction', image: '/images/fiction.svg' });
            expect(component.bookshelfForm.valid).toBe(true);
        });
    });

    describe('Form submission', () => {
        it('should not submit when form is invalid', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: '', image: '' });

            component.onSave();

            expect(mockBookshelvesHttpService.updateBookshelf).not.toHaveBeenCalled();
        });

        it('should mark all fields as touched when form is invalid on submit', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: '', image: '' });

            component.onSave();

            expect(component.bookshelfForm.get('name')?.touched).toBe(true);
            expect(component.bookshelfForm.get('image')?.touched).toBe(true);
        });

        it('should not submit when name is only whitespace', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: '   ', image: '/images/test.svg' });

            component.onSave();

            expect(mockBookshelvesHttpService.updateBookshelf).not.toHaveBeenCalled();
            expect(component.bookshelfForm.get('name')?.hasError('required')).toBe(true);
        });

        it('should not submit when image is only whitespace', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: 'Fiction', image: '   ' });

            component.onSave();

            expect(mockBookshelvesHttpService.updateBookshelf).not.toHaveBeenCalled();
            expect(component.bookshelfForm.get('image')?.hasError('required')).toBe(true);
        });

        it('should not submit when bookshelf is null', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', null);
            component.bookshelfForm.patchValue({ name: 'Fiction', image: '/images/fiction.svg' });

            component.onSave();

            expect(mockBookshelvesHttpService.updateBookshelf).not.toHaveBeenCalled();
        });

        it('should call bookshelfService.updateBookshelf with trimmed values when form is valid', () => {
            spyOn(bookshelfService, 'updateBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: '  Updated Fiction  ', image: '  /images/updated.svg  ' });

            component.onSave();

            expect(bookshelfService.updateBookshelf).toHaveBeenCalledWith(1, 'Updated Fiction', '/images/updated.svg');
        });

        it('should emit updated bookshelf after successful save', () => {
            spyOn(bookshelfService, 'updateBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: 'Updated Fiction', image: '/images/updated.svg' });

            component.onSave();

            expect(component.requestClose.emit).toHaveBeenCalledWith(
                jasmine.objectContaining({ id: 1, name: 'Updated Fiction', image: '/images/updated.svg' })
            );
        });

        it('should reset form after successful save', () => {
            spyOn(bookshelfService, 'updateBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            component.bookshelfForm.patchValue({ name: 'Updated', image: '/images/updated.svg' });

            component.onSave();

            expect(component.bookshelfForm.get('name')?.value).toBe('');
            expect(component.bookshelfForm.get('image')?.value).toBe('');
            expect(component.bookshelfForm.pristine).toBe(true);
        });

        it('should use correct bookshelf id when updating', () => {
            spyOn(bookshelfService, 'updateBookshelf');
            const shelf2: Bookshelf = { ...mockBookshelf, id: 5, name: 'Romance', image: '/images/romance.svg' };
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', shelf2);
            component.bookshelfForm.patchValue({ name: 'Updated Romance', image: '/images/romance-updated.svg' });

            component.onSave();

            expect(bookshelfService.updateBookshelf).toHaveBeenCalledWith(5, 'Updated Romance', '/images/romance-updated.svg');
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

            const input = fixture.nativeElement.querySelector('#updateBookshelfName');
            expect(input).toBeTruthy();
            expect(input.getAttribute('type')).toBe('text');
            expect(input.getAttribute('formControlName')).toBe('name');
        });

        it('should render form with bookshelf image input', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('#updateBookshelfImage');
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
            component.bookshelfForm.patchValue({ name: 'Fiction', image: '/images/fiction.svg' });
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

            expect(component.requestClose.emit).toHaveBeenCalledWith(null);
        });

        it('should render Update button', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const updateButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(updateButton).toBeTruthy();
            expect(updateButton.textContent.trim()).toBe('Update');
        });

        it('should disable Update button when form is invalid', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const updateButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(updateButton.disabled).toBe(true);
        });

        it('should enable Update button when form is valid', fakeAsync(() => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            fixture.detectChanges();
            tick();

            const updateButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(updateButton.disabled).toBe(false);
        }));

        it('should submit form when Update button is clicked', fakeAsync(() => {
            spyOn(bookshelfService, 'updateBookshelf');
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.componentRef.setInput('bookshelf', mockBookshelf);
            fixture.detectChanges();
            tick();

            const updateButton = fixture.nativeElement.querySelector('button[type="submit"]');
            updateButton.click();
            fixture.detectChanges();

            expect(bookshelfService.updateBookshelf).toHaveBeenCalledWith(1, 'Fiction', '/images/fiction.svg');
        }));
    });

    describe('Dialog component integration', () => {
        it('should pass correct title to dialog', () => {
            fixture.componentRef.setInput('isDialogOpen', true);
            fixture.detectChanges();

            const dialog = fixture.nativeElement.querySelector('app-dialog');
            expect(dialog).toBeTruthy();
            expect(component.dialogTitle).toBe('Update Bookshelf');
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
            expect(component.requestClose.emit).toHaveBeenCalledWith(null);
        });
    });
});
