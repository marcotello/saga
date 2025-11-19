import { Injectable, signal, computed, inject, Signal } from '@angular/core';
import { User, ErrorEnvelope, AuthSuccessEnvelope } from '../models/login-models';
import { AuthHttpMockService } from '../../services/auth-http-mock-service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly authHttpMockService = inject(AuthHttpMockService);
  private subscription: Subscription | null = null;

  private readonly _accessToken = signal<string | null>(null);
  private readonly _tokenType = signal<'Bearer' | null>(null);
  private readonly _expiresAt = signal<number | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _error = signal<ErrorEnvelope | null>(null);
  private readonly _isLoggedIn = signal<boolean>(true);

  readonly accessToken = this._accessToken.asReadonly();
  readonly tokenType = this._tokenType.asReadonly();
  readonly expiresAt = this._expiresAt.asReadonly();
  readonly user = this._user.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly authHeader = computed(() => {
    const token = this._accessToken();
    const type = this._tokenType();
    return token && type ? `${type} ${token}` : null;
  });

  login(credential: string, password: string): Signal<User | null> | Signal<ErrorEnvelope> {

    this._error.set(null);

    this.subscription = this.authHttpMockService.login(credential, password).subscribe({
      next: (response: AuthSuccessEnvelope) => {

        this.setSession({
          accessToken: response.data.accessToken,
          tokenType: response.data.tokenType,
          expiresIn: response.data.expiresIn,
          user: response.data.user
        });

        this._user.set(response.data.user);
        this._isLoggedIn.set(true);
      },
      error: (error: unknown) => {
        this._user.set(null);
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

    return this.user;
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

    this._user.set(payload.user);
  }

  private clearSession(): void {
    this._accessToken.set(null);
    this._tokenType.set(null);
    this._expiresAt.set(null);
    this._user.set(null);
    this._error.set(null);
    this._isLoggedIn.set(false);
  }
}

