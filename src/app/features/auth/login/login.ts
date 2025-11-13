import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AUTH_SERVICE, LoginService } from './login-service';
import { LoginHttpService } from './login-http-service';
import { credentialRequiredTrimmed, passwordStrength, maxLength } from './validators';
import { ErrorEnvelope } from './login.models';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: AUTH_SERVICE, useClass: LoginHttpService }
  ]
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AUTH_SERVICE);
  private readonly loginService = inject(LoginService);

  // Form state signals
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly passwordVisible = signal(false);

  // Reactive form with validators
  readonly loginForm = this.fb.nonNullable.group({
    credential: ['', [credentialRequiredTrimmed(), maxLength(254)]],
    password: ['', [credentialRequiredTrimmed(), maxLength(128), passwordStrength()]]
  });

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  /**
   * Get password input type based on visibility
   */
  getPasswordType(): 'text' | 'password' {
    return this.passwordVisible() ? 'text' : 'password';
  }

  /**
   * Get password toggle button label
   */
  getPasswordToggleLabel(): string {
    return this.passwordVisible() ? 'Hide password' : 'Show password';
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    // Clear previous error
    this.errorMessage.set(null);

    // Validate form
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show errors
      this.loginForm.markAllAsTouched();
      // Focus first invalid field
      this.focusFirstInvalidField();
      return;
    }

    // Prevent duplicate submissions
    if (this.isLoading()) {
      return;
    }

    // Start loading
    this.isLoading.set(true);

    try {
      const { credential, password } = this.loginForm.getRawValue();
      
      // Call auth service
      const response = await this.authService.login(credential, password);
      
      // Store session
      this.loginService.setSession(response.data);
      
      // Navigate to dashboard
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      // Handle error
      this.handleLoginError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Handle login errors
   */
  private handleLoginError(error: unknown): void {
    if (this.isErrorEnvelope(error)) {
      switch (error.code) {
        case 'INVALID_INPUT':
          // Show inline field errors
          this.errorMessage.set('Please check your input and try again.');
          // Mark fields as invalid
          this.loginForm.controls.credential.setErrors({ serverError: true });
          this.loginForm.controls.password.setErrors({ serverError: true });
          this.focusFirstInvalidField();
          break;
        
        case 'INVALID_CREDENTIALS':
          // Show banner message
          this.errorMessage.set('Invalid email or password.');
          break;
        
        case 'INTERNAL_SERVER_ERROR':
          // Show generic error
          this.errorMessage.set('An unexpected error occurred. Please try again later.');
          break;
        
        default:
          this.errorMessage.set('An unexpected error occurred. Please try again later.');
      }
    } else {
      // Network error or unknown error
      this.errorMessage.set('Unable to connect. Please try again later.');
    }
  }

  /**
   * Type guard for ErrorEnvelope
   */
  private isErrorEnvelope(error: unknown): error is ErrorEnvelope {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'code' in error &&
      'message' in error
    );
  }

  /**
   * Focus first invalid field
   */
  private focusFirstInvalidField(): void {
    // Use setTimeout to wait for DOM update
    setTimeout(() => {
      const firstInvalid = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }, 0);
  }

  /**
   * Get error message for credential field
   */
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

  /**
   * Get error message for password field
   */
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

  /**
   * Check if credential field has error
   */
  hasCredentialError(): boolean {
    return this.loginForm.controls.credential.invalid && this.loginForm.controls.credential.touched;
  }

  /**
   * Check if password field has error
   */
  hasPasswordError(): boolean {
    return this.loginForm.controls.password.invalid && this.loginForm.controls.password.touched;
  }
}
