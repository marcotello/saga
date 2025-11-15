import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly passwordVisible = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    credential: ['', [credentialRequiredTrimmed(), Validators.max(254)]],
    password: ['', [credentialRequiredTrimmed(), maxLength(128), passwordStrength()]]
  });

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  getPasswordType(): 'text' | 'password' {
    return this.passwordVisible() ? 'text' : 'password';
  }

  getPasswordToggleLabel(): string {
    return this.passwordVisible() ? 'Hide password' : 'Show password';
  }

  async onSubmit(): Promise<void> {
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

    try {
      const { credential, password } = this.loginForm.getRawValue();
      
      const response = await this.authService.login(credential, password);
      
      this.loginService.setSession(response.data);
      
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.isLoading.set(false);
    }
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
}
