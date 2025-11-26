import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WithLoadingState } from '../../../core/directives/with-loading-state';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, WithLoadingState],
  templateUrl: './account.html',
  styleUrl: './account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account {
  private readonly fb = inject(FormBuilder);
  readonly userService = inject(UserService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly updatingUserId = signal<number | null>(null);
  private previousUser: User | null = null;

  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      const user = this.userService.user();
      const updatingUserId = this.updatingUserId();
      const hasUserChanged = user !== this.previousUser;

      if (this.isLoading() && updatingUserId !== null && user?.id === updatingUserId && hasUserChanged) {
        this.isLoading.set(false);
        this.updatingUserId.set(null);
        this.errorMessage.set(null);
        this.passwordForm.reset();
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

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if ((newPassword || '').trim() !== (confirmPassword || '').trim()) {
      const confirmControl = this.passwordForm.controls.confirmPassword;
      confirmControl.setErrors({ mismatch: true });
      confirmControl.markAsTouched();
      this.errorMessage.set('New password and confirmation do not match.');
      this.focusFirstInvalidField();
      return;
    }

    const user = this.userService.user();
    if (!user) {
      this.errorMessage.set('User not found. Please log in again.');
      return;
    }

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.updatingUserId.set(user.id);

    setTimeout(() => {
      if (this.isLoading() && this.updatingUserId() === user.id) {
        this.isLoading.set(false);
        this.updatingUserId.set(null);
      }
    }, 5000);

    this.userService.updatePassword(
      user.id,
      (currentPassword || '').trim(),
      (newPassword || '').trim()
    );
  }

  getCurrentPasswordError(): string | null {
    const control = this.passwordForm.controls.currentPassword;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Current password is required';
    }

    return null;
  }

  getNewPasswordError(): string | null {
    const control = this.passwordForm.controls.newPassword;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'New password is required';
    }

    if (control.errors['minlength']) {
      return 'Password must be at least 8 characters';
    }

    return null;
  }

  getConfirmPasswordError(): string | null {
    const control = this.passwordForm.controls.confirmPassword;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Please confirm your new password';
    }

    if (control.errors['mismatch']) {
      return 'Passwords do not match';
    }

    return null;
  }

  hasCurrentPasswordError(): boolean {
    return this.passwordForm.controls.currentPassword.invalid && this.passwordForm.controls.currentPassword.touched;
  }

  hasNewPasswordError(): boolean {
    return this.passwordForm.controls.newPassword.invalid && this.passwordForm.controls.newPassword.touched;
  }

  hasConfirmPasswordError(): boolean {
    return this.passwordForm.controls.confirmPassword.invalid && this.passwordForm.controls.confirmPassword.touched;
  }

  private focusFirstInvalidField(): void {
    setTimeout(() => {
      const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
    }, 0);
  }

}
