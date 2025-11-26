import { ChangeDetectionStrategy, Component, inject, signal, effect, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LoginService } from '../services/login-service';
import { passwordStrength, notOnlyWhitespace } from '../../../../core/validators/auth-validators';
import { ErrorEnvelope } from '../models/login-models';
import { UserService } from '../../../../core/services/user-service';
import { PasswordToggleDirective } from '../../../../core/directives/password-toggle';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgOptimizedImage, RouterLink, PasswordToggleDirective],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly userService = inject(UserService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly isSubmitting = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    credential: ['', [Validators.required, Validators.maxLength(254), notOnlyWhitespace()]],
    password: ['', [Validators.required, Validators.maxLength(128), passwordStrength()]]
  });

  constructor() {
    effect(() => {
      if (!this.isSubmitting()) {
        return;
      }

      const user = this.userService.user();
      const error = this.loginService.error();

      untracked(() => {
        if (user) {
          this.isLoading.set(false);
          this.isSubmitting.set(false);
          this.errorMessage.set(null);
          this.router.navigate(['/dashboard']);
        } else if (error) {
          this.isLoading.set(false);
          this.isSubmitting.set(false);
          this.handleLoginError(error);
        }
      });
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.isSubmitting.set(true);

    const { credential, password } = this.loginForm.getRawValue();

    const trimmedCredential = credential.trim();
    const trimmedPassword = password.trim();

    this.loginService.login(trimmedCredential, trimmedPassword);
  }

  getCredentialError(): string | null {
    const control = this.loginForm.controls.credential;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Email or username is required';
    }
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
    }
    if (control.errors['serverError']) {
      return 'Invalid input';
    }
    return null;
  }

  getPasswordError(): string | null {
    const control = this.loginForm.controls.password;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Password is required';
    }

    if (control.errors['passwordStrength']) {
      return control.errors['passwordStrength'].message;
    }

    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
    }

    if (control.errors['serverError']) {
      return 'Invalid input';
    }

    return null;
  }

  hasCredentialError(): boolean {
    return this.loginForm.controls.credential.invalid && this.loginForm.controls.credential.touched;
  }

  hasPasswordError(): boolean {
    return this.loginForm.controls.password.invalid && this.loginForm.controls.password.touched;
  }

  private handleLoginError(error: unknown): void {
    if (this.isErrorEnvelope(error)) {
      switch (error.code) {
        case 'INVALID_INPUT':
          this.errorMessage.set('Please check your input and try again.');
          this.loginForm.controls.credential.setErrors({ serverError: true });
          this.loginForm.controls.password.setErrors({ serverError: true });
          this.focusFirstInvalidField();
          break;

        case 'INVALID_CREDENTIALS':
          this.errorMessage.set('Invalid email or password.');
          break;

        case 'INTERNAL_SERVER_ERROR':
          this.errorMessage.set('An unexpected error occurred. Please try again later.');
          break;

        default:
          this.errorMessage.set('An unexpected error occurred. Please try again later.');
      }
    } else {
      this.errorMessage.set('Unable to connect. Please try again later.');
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
