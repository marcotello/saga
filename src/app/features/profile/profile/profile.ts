import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../core/models/user';
import { ErrorEnvelope } from '../../auth/login/models/login-models';
import { WithLoadingState } from '../../../core/directives/with-loading-state';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, WithLoadingState],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  readonly userService = inject(UserService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly updatingUserId = signal<number | null>(null);
  private previousUser: User | null = null;

  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    bio: ['' as string | null]
  });

  constructor() {
    effect(() => {
      const user: User | null = this.userService.user();
      const updatingUserId = this.updatingUserId();
      const hasUserChanged = user !== this.previousUser;
      
      if (user) {
        this.profileForm.patchValue({
          firstName: user.name,
          lastName: user.lastName,
          email: user.email,
          bio: user.bio || null
        });
      }
      
      if (this.isLoading() && updatingUserId !== null && user?.id === updatingUserId && hasUserChanged) {
        this.isLoading.set(false);
        this.updatingUserId.set(null);
        this.errorMessage.set(null);
      }
      
      this.previousUser = user;
    });
  }

  onLoadingComplete(): void {
    this.updatingUserId.set(null);
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }

    if (this.isLoading()) {
      return;
    }

    const currentUser: User | null = this.userService.user();
    if (!currentUser) {
      this.errorMessage.set('User not found. Please log in again.');
      return;
    }

    this.isLoading.set(true);
    this.updatingUserId.set(currentUser.id);

    const { firstName, lastName, email, bio } = this.profileForm.getRawValue();

    const updatedUser: User = {
      ...currentUser,
      name: (firstName || '').trim(),
      lastName: (lastName || '').trim(),
      email: (email || '').trim(),
      bio: bio?.trim() || null
    };

    setTimeout(() => {
      if (this.isLoading() && this.updatingUserId() === currentUser.id) {
        this.isLoading.set(false);
        this.updatingUserId.set(null);
      }
    }, 5000);

    this.userService.updateProfileById(updatedUser);
  }

  getFirstNameError(): string | null {
    const control = this.profileForm.controls.firstName;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'First name is required';
    }
    return null;
  }

  getLastNameError(): string | null {
    const control = this.profileForm.controls.lastName;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Last name is required';
    }
    return null;
  }

  getEmailError(): string | null {
    const control = this.profileForm.controls.email;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Email is required';
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  hasFirstNameError(): boolean {
    return this.profileForm.controls.firstName.invalid && this.profileForm.controls.firstName.touched;
  }

  hasLastNameError(): boolean {
    return this.profileForm.controls.lastName.invalid && this.profileForm.controls.lastName.touched;
  }

  hasEmailError(): boolean {
    return this.profileForm.controls.email.invalid && this.profileForm.controls.email.touched;
  }

  private handleUpdateError(error: unknown): void {
    if (this.isErrorEnvelope(error)) {
      if (error.code === 'INTERNAL_SERVER_ERROR' && error.message === 'User not found') {
        this.errorMessage.set('User not found. Please log in again.');
      } else {
        this.errorMessage.set('An unexpected error occurred. Please try again later.');
      }
    } else {
      this.errorMessage.set('Unable to update profile. Please try again later.');
    }
  }

  private isErrorEnvelope(error: unknown): error is ErrorEnvelope {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'code' in error &&
      'message' in error
    );
  }

  private focusFirstInvalidField(): void {
    setTimeout(() => {
      const firstInvalid = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }, 0);
  }
}
