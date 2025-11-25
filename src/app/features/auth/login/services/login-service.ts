import { Injectable, signal, computed, inject } from '@angular/core';
import { ErrorEnvelope, AuthSuccessEnvelope } from '../models/login-models';
import { Subscription } from 'rxjs';
import { User } from '../../../../core/models/models';
import { UserHttpMockService } from '../../../../core/mock-api/user-http-mock-service';
import { UserService } from '../../../../core/services/user-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly authHttpMockService = inject(UserHttpMockService);
  private readonly userService = inject(UserService);

  private subscription: Subscription | null = null;

  private readonly _accessToken = signal<string | null>(null);
  private readonly _tokenType = signal<'Bearer' | null>(null);
  private readonly _expiresAt = signal<number | null>(null);
  private readonly _error = signal<ErrorEnvelope | null>(null);
  private readonly _isLoggedIn = signal<boolean>(false);

  readonly accessToken = this._accessToken.asReadonly();
  readonly tokenType = this._tokenType.asReadonly();
  readonly expiresAt = this._expiresAt.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly authHeader = computed(() => {
    const token = this._accessToken();
    const type = this._tokenType();
    return token && type ? `${type} ${token}` : null;
  });

  login(credential: string, password: string): void {

    this._error.set(null);

    this.subscription = this.authHttpMockService.login(credential, password).subscribe({
      next: (response: AuthSuccessEnvelope) => {

        this.setSession({
          accessToken: response.data.accessToken,
          tokenType: response.data.tokenType,
          expiresIn: response.data.expiresIn,
          user: response.data.user
        });

        this.userService.setUser(response.data.user);
        this._isLoggedIn.set(true);
      },
      error: (error: unknown) => {
        this.userService.setUser(null);
        this._isLoggedIn.set(false);

        if (this.isErrorEnvelope(error)) {
          this._error.set(error);
        } else {
          this._error.set({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
          });
        }
      }
    });
  }

  private isErrorEnvelope(error: unknown): error is ErrorEnvelope {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'code' in error &&
      'message' in error &&
      (error as ErrorEnvelope).status === 'error'
    );
  }

  logout(): void {
    this.clearSession();
  }

  private setSession(payload: { accessToken: string; tokenType: 'Bearer'; expiresIn: number; user: User }): void {
    this._accessToken.set(payload.accessToken);
    this._tokenType.set(payload.tokenType);

    const expiresAtMs = Date.now() + (payload.expiresIn * 1000);
    this._expiresAt.set(expiresAtMs);

    this.userService.setUser(payload.user ?? null);
  }

  private clearSession(): void {
    this._accessToken.set(null);
    this._tokenType.set(null);
    this._expiresAt.set(null);
    this.userService.setUser(null);
    this._error.set(null);
    this._isLoggedIn.set(false);
  }
}

