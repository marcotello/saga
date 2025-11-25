import { Injectable } from '@angular/core';
import userData from '../../mocks/users.json';
import { ErrorEnvelope, AuthSuccessEnvelope } from '../../features/auth/login/models/login-models';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserHttpMockService {

  login(credential: string, password: string): Observable<AuthSuccessEnvelope> {
    const foundUser = userData.find(
      user => (user.email === credential || user.username === credential)
        && user.password === password);

    if (!foundUser) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      };
      return throwError(() => error);
    }

    const user: User = {
      id: foundUser.id,
      username: foundUser.username,
      name: foundUser.name,
      lastName: foundUser.lastName,
      email: foundUser.email,
      bio: foundUser.bio || null,
      role: foundUser.role.toString()
    };

    const accessToken = `mock-token-${foundUser.id}-${Date.now()}`;
    const tokenType = 'Bearer' as const;
    const expiresIn = 3600;

    const authSuccessEnvelope: AuthSuccessEnvelope = {
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken,
        tokenType,
        expiresIn,
        user
      }
    };

    return of(authSuccessEnvelope);
  }

}
