import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginService } from './login-service';
import { AuthHttpMockService } from '../../services/auth-http-mock-service';
import { AuthSuccessEnvelope, ErrorEnvelope, User } from '../models/login-models';
import { of, throwError, delay, Subject } from 'rxjs';

describe('LoginService', () => {
  let service: LoginService;
  let mockAuthHttpService: jasmine.SpyObj<AuthHttpMockService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    name: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    bio: 'Test bio',
    role: '1'
  };

  const mockSuccessResponse: AuthSuccessEnvelope = {
    status: 'success',
    message: 'Login successful',
    data: {
      accessToken: 'mock-token-123',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: mockUser
    }
  };

  const mockErrorResponse: ErrorEnvelope = {
    status: 'error',
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password'
  };

  beforeEach(() => {
    mockAuthHttpService = jasmine.createSpyObj('AuthHttpMockService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: AuthHttpMockService, useValue: mockAuthHttpService }
      ]
    });

    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have null accessToken initially', () => {
      expect(service.accessToken()).toBeNull();
    });

    it('should have null tokenType initially', () => {
      expect(service.tokenType()).toBeNull();
    });

    it('should have null expiresAt initially', () => {
      expect(service.expiresAt()).toBeNull();
    });

    it('should have null user initially', () => {
      expect(service.user()).toBeNull();
    });

    it('should have null error initially', () => {
      expect(service.error()).toBeNull();
    });

    it('should have false isLoggedIn initially', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should have false isAuthenticated initially', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should have null authHeader initially', () => {
      expect(service.authHeader()).toBeNull();
    });
  });

  describe('login - success', () => {
    it('should call authHttpMockService.login with credentials', () => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      expect(mockAuthHttpService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should set accessToken on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.accessToken()).toBe('mock-token-123');
        done();
      }, 10);
    });

    it('should set tokenType on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.tokenType()).toBe('Bearer');
        done();
      }, 10);
    });

    it('should set expiresAt on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));
      const beforeTime = Date.now();

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        const expiresAt = service.expiresAt();
        expect(expiresAt).toBeTruthy();
        expect(expiresAt).toBeGreaterThan(beforeTime);
        expect(expiresAt).toBeLessThanOrEqual(beforeTime + 3601000); // 3600s + 1s buffer
        done();
      }, 10);
    });

    it('should set user on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.user()).toEqual(mockUser);
        done();
      }, 10);
    });

    it('should set isLoggedIn to true on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.isLoggedIn()).toBe(true);
        done();
      }, 10);
    });

    it('should set isAuthenticated to true on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.isAuthenticated()).toBe(true);
        done();
      }, 10);
    });

    it('should clear error on successful login', (done) => {
      // First set an error
      service['_error'].set(mockErrorResponse);
      expect(service.error()).toBeTruthy();

      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.error()).toBeNull();
        done();
      }, 10);
    });

    it('should return user signal', () => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      const result = service.login('test@example.com', 'password123');

      expect(result).toBe(service.user);
    });

    it('should generate correct authHeader on successful login', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.authHeader()).toBe('Bearer mock-token-123');
        done();
      }, 10);
    });
  });

  describe('login - error', () => {
    it('should set error signal on login failure', (done) => {
      mockAuthHttpService.login.and.returnValue(throwError(() => mockErrorResponse));

      service.login('test@example.com', 'wrongpassword');

      setTimeout(() => {
        expect(service.error()).toEqual(mockErrorResponse);
        done();
      }, 10);
    });

    it('should clear user on login failure', (done) => {
      // First set a user
      service['_user'].set(mockUser);
      expect(service.user()).toBeTruthy();

      mockAuthHttpService.login.and.returnValue(throwError(() => mockErrorResponse));

      service.login('test@example.com', 'wrongpassword');

      setTimeout(() => {
        expect(service.user()).toBeNull();
        done();
      }, 10);
    });

    it('should set isLoggedIn to false on login failure', (done) => {
      // First set logged in
      service['_isLoggedIn'].set(true);

      mockAuthHttpService.login.and.returnValue(throwError(() => mockErrorResponse));

      service.login('test@example.com', 'wrongpassword');

      setTimeout(() => {
        expect(service.isLoggedIn()).toBe(false);
        done();
      }, 10);
    });

    it('should handle non-ErrorEnvelope errors', (done) => {
      const genericError = new Error('Network error');
      mockAuthHttpService.login.and.returnValue(throwError(() => genericError));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        const error = service.error();
        expect(error).toBeTruthy();
        expect(error?.code).toBe('INTERNAL_SERVER_ERROR');
        expect(error?.message).toBe('An unexpected error occurred');
        done();
      }, 10);
    });

    it('should clear previous error before new login attempt', fakeAsync(() => {
      // Set an error first
      service['_error'].set(mockErrorResponse);

      // Use a Subject to control the response timing precisely
      const errorSubject = new Subject<AuthSuccessEnvelope>();
      mockAuthHttpService.login.and.returnValue(errorSubject.asObservable());

      service.login('test@example.com', 'wrongpassword');

      // Error should be cleared immediately upon calling login
      expect(service.error()).toBeNull();

      // Emit the error
      errorSubject.error({
        ...mockErrorResponse,
        message: 'New error'
      });

      tick();

      expect(service.error()?.message).toBe('New error');
    }));
  });

  describe('logout', () => {
    it('should clear all session data on logout', (done) => {
      // First login
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));
      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.isAuthenticated()).toBe(true);

        // Then logout
        service.logout();

        expect(service.accessToken()).toBeNull();
        expect(service.tokenType()).toBeNull();
        expect(service.expiresAt()).toBeNull();
        expect(service.user()).toBeNull();
        expect(service.error()).toBeNull();
        expect(service.isLoggedIn()).toBe(false);
        expect(service.isAuthenticated()).toBe(false);
        expect(service.authHeader()).toBeNull();
        done();
      }, 10);
    });
  });

  describe('computed signals', () => {
    it('should compute isAuthenticated based on accessToken', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      expect(service.isAuthenticated()).toBe(false);

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.isAuthenticated()).toBe(true);
        done();
      }, 10);
    });

    it('should compute authHeader correctly', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.authHeader()).toBe('Bearer mock-token-123');
        done();
      }, 10);
    });

    it('should return null authHeader when token is missing', () => {
      expect(service.authHeader()).toBeNull();
    });

    it('should return null authHeader when tokenType is missing', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        service['_tokenType'].set(null);
        expect(service.authHeader()).toBeNull();
        done();
      }, 10);
    });
  });

  describe('multiple login attempts', () => {
    it('should handle multiple sequential login attempts', (done) => {
      mockAuthHttpService.login.and.returnValue(of(mockSuccessResponse));

      service.login('test@example.com', 'password123');

      setTimeout(() => {
        expect(service.isAuthenticated()).toBe(true);

        // Second login attempt
        const secondUser = { ...mockUser, id: 2, username: 'user2' };
        const secondResponse: AuthSuccessEnvelope = {
          ...mockSuccessResponse,
          data: {
            ...mockSuccessResponse.data,
            accessToken: 'mock-token-456',
            user: secondUser
          }
        };
        mockAuthHttpService.login.and.returnValue(of(secondResponse));

        service.login('user2@example.com', 'password123');

        setTimeout(() => {
          expect(service.user()?.id).toBe(2);
          expect(service.accessToken()).toBe('mock-token-456');
          done();
        }, 10);
      }, 10);
    });
  });
});

