/**
 * Login Service with in-memory AuthStore using signals
 * Provides auth state management and service abstraction
 */

import { Injectable, InjectionToken, signal, computed } from '@angular/core';
import { AuthSuccessEnvelope, User, AuthSession } from './login.models';

/**
 * Abstract interface for authentication service
 * Allows mock and HTTP implementations
 */
export interface IAuthService {
  login(credential: string, password: string): Promise<AuthSuccessEnvelope>;
}

/**
 * DI token for auth service injection
 */
export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');

/**
 * LoginService - Manages authentication state in-memory using signals
 * Non-persistent: cleared on page reload
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Auth session signals
  private readonly _accessToken = signal<string | null>(null);
  private readonly _tokenType = signal<'Bearer' | null>(null);
  private readonly _expiresAt = signal<number | null>(null);
  private readonly _user = signal<User | null>(null);

  // Public readonly signals
  readonly accessToken = this._accessToken.asReadonly();
  readonly tokenType = this._tokenType.asReadonly();
  readonly expiresAt = this._expiresAt.asReadonly();
  readonly user = this._user.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly authHeader = computed(() => {
    const token = this._accessToken();
    const type = this._tokenType();
    return token && type ? `${type} ${token}` : null;
  });

  /**
   * Set authentication session from successful login
   */
  setSession(payload: { accessToken: string; tokenType: 'Bearer'; expiresIn: number; user: User }): void {
    this._accessToken.set(payload.accessToken);
    this._tokenType.set(payload.tokenType);
    
    // Calculate expiration timestamp (current time + expiresIn seconds)
    const expiresAtMs = Date.now() + (payload.expiresIn * 1000);
    this._expiresAt.set(expiresAtMs);
    
    this._user.set(payload.user);
  }

  /**
   * Clear authentication session (logout)
   */
  clearSession(): void {
    this._accessToken.set(null);
    this._tokenType.set(null);
    this._expiresAt.set(null);
    this._user.set(null);
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    this.clearSession();
  }

  /**
   * Get current session snapshot
   */
  getSession(): AuthSession {
    return {
      accessToken: this._accessToken(),
      tokenType: this._tokenType(),
      expiresAt: this._expiresAt(),
      user: this._user()
    };
  }
}

