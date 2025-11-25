import { Injectable } from '@angular/core';
import userData from '../../mocks/users.json';
import { ErrorEnvelope, AuthSuccessEnvelope } from '../../features/auth/login/models/login-models';
import { Observable, of, throwError, delay } from 'rxjs';
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

  updateProfileById(id: number, updatedFields: Partial<User>): Observable<User> {
    const userIndex = userData.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found'
      };
      return throwError(() => error);
    }

    // Update the user in the array
    const existingUser = userData[userIndex];
    const bioValue = updatedFields.bio === undefined ? existingUser.bio : (updatedFields.bio || '');
    const updatedUser = { 
      ...existingUser, 
      name: updatedFields.name ?? existingUser.name,
      lastName: updatedFields.lastName ?? existingUser.lastName,
      email: updatedFields.email ?? existingUser.email,
      bio: bioValue
    };
    userData[userIndex] = updatedUser;

    const user: User = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      bio: updatedUser.bio || null,
      role: updatedUser.role.toString()
    };

    return of(user).pipe(delay(2000));
  }

}
