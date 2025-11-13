/**
 * HTTP-based authentication service
 * Calls the backend API at /api/auth/login
 * Aligned with specs/006-refactor-login/contracts/openapi.yaml
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IAuthService } from './login-service';
import { AuthSuccessEnvelope, CredentialInput, ErrorEnvelope } from './login.models';

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService implements IAuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/auth/login';

  /**
   * Login via HTTP POST
   * @param credential - username or email
   * @param password - user password
   * @returns Promise of success envelope
   * @throws ErrorEnvelope on failure
   */
  async login(credential: string, password: string): Promise<AuthSuccessEnvelope> {
    const payload: CredentialInput = {
      credential: credential.trim(),
      password: password.trim()
    };

    try {
      const response = await firstValueFrom(
        this.http.post<AuthSuccessEnvelope>(this.apiUrl, payload)
      );
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // Server returned an error response
        if (error.error && typeof error.error === 'object' && 'status' in error.error) {
          // API returned error envelope
          throw error.error as ErrorEnvelope;
        }
        
        // Map HTTP status to error envelope
        if (error.status === 400) {
          throw {
            status: 'error',
            code: 'INVALID_INPUT',
            message: error.error?.message || 'Invalid input provided'
          } as ErrorEnvelope;
        } else if (error.status === 401) {
          throw {
            status: 'error',
            code: 'INVALID_CREDENTIALS',
            message: error.error?.message || 'Invalid email or password'
          } as ErrorEnvelope;
        } else if (error.status >= 500) {
          throw {
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: error.error?.message || 'An unexpected error occurred. Please try again later.'
          } as ErrorEnvelope;
        }
      }
      
      // Network error or unknown error
      throw {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to connect. Please try again later.'
      } as ErrorEnvelope;
    }
  }
}

