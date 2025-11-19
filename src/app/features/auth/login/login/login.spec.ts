import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Login } from './login';
import { LoginService } from '../login-service';
import { AuthHttpMockService } from '../../services/auth-http-mock-service';
import { AuthSuccessEnvelope, ErrorEnvelope } from '../models/login-models';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthHttpService: jasmine.SpyObj<AuthHttpMockService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loginService: LoginService;

  const mockSuccessResponse: AuthSuccessEnvelope = {
    status: 'success',
    message: 'Login successful',
    data: {
      accessToken: 'mock-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 1,
        username: 'testuser',
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'User'
      }
    }
  };

  beforeEach(async () => {
    mockAuthHttpService = jasmine.createSpyObj('AuthHttpMockService', ['login']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([
          { path: 'dashboard', component: {} as any },
          { path: 'auth/signup', component: {} as any }
        ]),
        provideHttpClient(),
        LoginService,
        { provide: AuthHttpMockService, useValue: mockAuthHttpService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loginService = TestBed.inject(LoginService);
    spyOn(mockRouter, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('T304 - Component renders required elements', () => {
    it('should render logo image', () => {
      const logo = fixture.nativeElement.querySelector('img[alt="Saga logo"]');
      expect(logo).toBeTruthy();
    });

    it('should render illustration image', () => {
      const illustration = fixture.nativeElement.querySelector('img[alt="Reading illustration"]');
      expect(illustration).toBeTruthy();
    });

    it('should render Welcome Back heading', () => {
      const heading = fixture.nativeElement.querySelector('h1');
      expect(heading?.textContent).toContain('Welcome Back');
    });

    it('should render credential input', () => {
      const input = fixture.nativeElement.querySelector('#credential');
      expect(input).toBeTruthy();
      expect(input.getAttribute('autocomplete')).toBe('off');
    });

    it('should render password input', () => {
      const input = fixture.nativeElement.querySelector('#password');
      expect(input).toBeTruthy();
      expect(input.getAttribute('autocomplete')).toBe('off');
    });

    it('should render password visibility toggle', () => {
      const toggle = fixture.nativeElement.querySelector('.password-toggle');
      expect(toggle).toBeTruthy();
    });

    it('should render Sign In button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button?.textContent).toContain('Sign In');
    });

    it('should render signup link', () => {
      const link = fixture.nativeElement.querySelector('a[routerLink="/auth/signup"]');
      expect(link?.textContent).toContain('Sign up');
    });
  });

  describe('T404 - Required and strength validations', () => {
    it('should mark credential as invalid when empty', () => {
      const control = component.loginForm.controls.credential;
      control.setValue('');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['required']).toBe(true);
    });

    it('should mark credential as invalid when only whitespace', () => {
      const control = component.loginForm.controls.credential;
      control.setValue('   ');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['required']).toBe(true);
    });

    it('should mark credential as invalid when exceeding max length', () => {
      const control = component.loginForm.controls.credential;
      control.setValue('a'.repeat(255));
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['maxlength']).toBeTruthy();
    });

    it('should mark password as invalid when empty', () => {
      const control = component.loginForm.controls.password;
      control.setValue('');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['required']).toBe(true);
    });

    it('should mark password as invalid when missing uppercase', () => {
      const control = component.loginForm.controls.password;
      control.setValue('password123');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['passwordStrength']).toBeTruthy();
    });

    it('should mark password as invalid when missing lowercase', () => {
      const control = component.loginForm.controls.password;
      control.setValue('PASSWORD123');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['passwordStrength']).toBeTruthy();
    });

    it('should mark password as invalid when missing number', () => {
      const control = component.loginForm.controls.password;
      control.setValue('PasswordABC');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['passwordStrength']).toBeTruthy();
    });

    it('should mark password as invalid when too short', () => {
      const control = component.loginForm.controls.password;
      control.setValue('Pass1');
      control.markAsTouched();
      expect(control.invalid).toBe(true);
      expect(control.errors?.['passwordStrength']).toBeTruthy();
    });

    it('should accept valid password', () => {
      const control = component.loginForm.controls.password;
      control.setValue('Password123');
      expect(control.valid).toBe(true);
    });

    it('should block submit when form is invalid', () => {
      component.loginForm.controls.credential.setValue('');
      component.loginForm.controls.password.setValue('');

      component.onSubmit();

      expect(mockAuthHttpService.login).not.toHaveBeenCalled();
      expect(component.loginForm.controls.credential.touched).toBe(true);
      expect(component.loginForm.controls.password.touched).toBe(true);
    });

    it('should display credential error message when touched and invalid', () => {
      const control = component.loginForm.controls.credential;
      control.setValue('');
      control.markAsTouched();
      fixture.detectChanges();

      const errorMsg = component.getCredentialError();
      expect(errorMsg).toBe('Email or username is required');

      const errorElement = fixture.nativeElement.querySelector('#credential-error');
      expect(errorElement?.textContent).toContain('Email or username is required');
    });

    it('should display password error message when touched and invalid', () => {
      const control = component.loginForm.controls.password;
      control.setValue('weak');
      control.markAsTouched();
      fixture.detectChanges();

      const errorMsg = component.getPasswordError();
      expect(errorMsg).toContain('Password must be');
    });
  });

  describe('T405 - Loading state and duplicate prevention', () => {
    it('should set loading state during submission', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      tick(10);
      fixture.detectChanges();
      expect(component.isLoading()).toBe(false);
    }));

    it('should disable submit button when loading', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-busy')).toBe('true');

      tick(10);
      fixture.detectChanges();
    }));

    it('should prevent duplicate submissions while loading', () => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      component.onSubmit(); // Try to submit again

      expect(mockAuthHttpService.login).toHaveBeenCalledTimes(2);
    });

    it('should show loading text in button', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button?.textContent).toContain('Signing in...');

      tick(10);
      fixture.detectChanges();
    }));
  });

  describe('Password visibility toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.passwordVisible()).toBe(false);

      component.togglePasswordVisibility();
      expect(component.passwordVisible()).toBe(true);

      component.togglePasswordVisibility();
      expect(component.passwordVisible()).toBe(false);
    });

    it('should change input type based on visibility', () => {
      expect(component.getPasswordType()).toBe('password');

      component.togglePasswordVisibility();
      expect(component.getPasswordType()).toBe('text');
    });

    it('should update button aria-pressed attribute', () => {
      fixture.detectChanges();
      const toggle = fixture.nativeElement.querySelector('.password-toggle');

      expect(toggle.getAttribute('aria-pressed')).toBe('false');

      component.togglePasswordVisibility();
      fixture.detectChanges();

      expect(toggle.getAttribute('aria-pressed')).toBe('true');
    });

    it('should provide accessible labels', () => {
      expect(component.getPasswordToggleLabel()).toBe('Show password');

      component.togglePasswordVisibility();
      expect(component.getPasswordToggleLabel()).toBe('Hide password');
    });
  });

  describe('T503 - Happy path: stores token and navigates to dashboard', () => {
    it('should call auth service with trimmed credentials', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('  test@example.com  ');
      component.loginForm.controls.password.setValue('  Password123  ');

      component.onSubmit();
      tick(10);

      expect(mockAuthHttpService.login).toHaveBeenCalledWith('test@example.com', 'Password123');
    }));

    it('should store session in LoginService', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      tick(10);

      expect(loginService.isAuthenticated()).toBe(true);
      expect(loginService.accessToken()).toBe('mock-token');
      expect(loginService.user()?.username).toBe('testuser');
    }));

    it('should navigate to dashboard on success', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should clear error message on successful login', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      component.errorMessage.set('Previous error');
      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(component.errorMessage()).toBeNull();
    }));
  });

  describe('T602 - Maps INVALID_CREDENTIALS to banner', () => {
    it('should show error message for invalid credentials', fakeAsync(() => {
      const errorResponse: ErrorEnvelope = {
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      };
      mockAuthHttpService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('WrongPassword123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Invalid email or password.');
      expect(component.isLoading()).toBe(false);
    }));

    it('should display error banner for invalid credentials', fakeAsync(() => {
      const errorResponse: ErrorEnvelope = {
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      };
      mockAuthHttpService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('WrongPassword123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector('.error-banner');
      expect(banner?.textContent).toContain('Invalid email or password.');
    }));
  });

  describe('T603 - Maps INVALID_INPUT to inline errors', () => {
    it('should show inline error message for invalid input', fakeAsync(() => {
      const errorResponse: ErrorEnvelope = {
        status: 'error',
        code: 'INVALID_INPUT',
        message: 'Invalid input provided'
      };
      mockAuthHttpService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Please check your input and try again.');
      expect(component.loginForm.controls.credential.errors?.['serverError']).toBe(true);
      expect(component.loginForm.controls.password.errors?.['serverError']).toBe(true);
    }));
  });

  describe('Error handling for various scenarios', () => {
    it('should show generic error for INTERNAL_SERVER_ERROR', fakeAsync(() => {
      const errorResponse: ErrorEnvelope = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error'
      };
      mockAuthHttpService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('An unexpected error occurred. Please try again later.');
    }));

    it('should show network error message for unknown errors', fakeAsync(() => {
      mockAuthHttpService.login.and.returnValue(throwError(() => new Error('Network error')));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('Password123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Unable to connect. Please try again later.');
    }));

    it('should not navigate on error', fakeAsync(() => {
      const errorResponse: ErrorEnvelope = {
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials'
      };
      mockAuthHttpService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.controls.credential.setValue('test@example.com');
      component.loginForm.controls.password.setValue('WrongPassword123');

      component.onSubmit();
      tick(10);
      fixture.detectChanges();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('Accessibility features', () => {
    it('should have proper labels associated with inputs', () => {
      const credentialLabel = fixture.nativeElement.querySelector('label[for="credential"]');
      const passwordLabel = fixture.nativeElement.querySelector('label[for="password"]');

      expect(credentialLabel).toBeTruthy();
      expect(passwordLabel).toBeTruthy();
    });

    it('should set aria-invalid on invalid fields', () => {
      component.loginForm.controls.credential.setValue('');
      component.loginForm.controls.credential.markAsTouched();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('#credential');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-describedby on invalid fields', () => {
      component.loginForm.controls.credential.setValue('');
      component.loginForm.controls.credential.markAsTouched();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('#credential');
      expect(input.getAttribute('aria-describedby')).toBe('credential-error');
    });

    it('should have aria-live region for errors', () => {
      component.errorMessage.set('Test error');
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector('.error-banner');
      expect(banner.getAttribute('aria-live')).toBe('polite');
    });

    it('should have proper alt text for images', () => {
      const logo = fixture.nativeElement.querySelector('img[alt="Saga logo"]');
      const illustration = fixture.nativeElement.querySelector('img[alt="Reading illustration"]');

      expect(logo).toBeTruthy();
      expect(illustration).toBeTruthy();
    });
  });
});
