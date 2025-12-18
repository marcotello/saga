import { Injectable } from '@angular/core';
import userData from '../mocks-data/users.json';
import userStatisticsData from '../mocks-data/user-statistics.json';
import { ErrorEnvelope, AuthSuccessEnvelope } from '../../../features/auth/login/models/login-models';
import { Observable, of, throwError, delay } from 'rxjs';
import { User } from '../../models/user';
import { UserStatistics } from '../../models/user-statistics';

type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserHttpMockService {

  private users: any[] = [];
  private userStatistics: UserStatistics[] = [];

  constructor() {
    this.users = structuredClone(userData);
    this.userStatistics = structuredClone(userStatisticsData);
  }

  login(credential: string, password: string): Observable<AuthSuccessEnvelope> {
    const foundUser = this.users.find(
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
      role: foundUser.role.toString(),
      profilePicture: foundUser.profilePicture
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
    const userIndex = this.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found'
      };
      return throwError(() => error);
    }

    // Update the user in the array
    const existingUser = this.users[userIndex];
    const bioValue = updatedFields.bio === undefined ? existingUser.bio : (updatedFields.bio || '');
    const updatedUser = {
      ...existingUser,
      name: updatedFields.name ?? existingUser.name,
      lastName: updatedFields.lastName ?? existingUser.lastName,
      email: updatedFields.email ?? existingUser.email,
      bio: bioValue
    };
    this.users[userIndex] = updatedUser;

    const user: User = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      bio: updatedUser.bio || null,
      role: updatedUser.role.toString(),
      profilePicture: updatedUser.profilePicture
    };

    return of(user).pipe(delay(2000));
  }

  updatePassword(id: number, payload: UpdatePasswordPayload): Observable<User> {
    const userIndex = this.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found'
      };
      return throwError(() => error);
    }

    const existingUser = this.users[userIndex];

    this.users[userIndex] = {
      ...existingUser,
      password: payload.newPassword
    };

    const user: User = {
      id: existingUser.id,
      username: existingUser.username,
      name: existingUser.name,
      lastName: existingUser.lastName,
      email: existingUser.email,
      bio: existingUser.bio || null,
      role: existingUser.role.toString(),
      profilePicture: existingUser.profilePicture
    };

    return of(user).pipe(delay(2000));
  }

  getStatisticsByUserId(userId: number): Observable<UserStatistics | null> {
    const statistics = this.userStatistics.find(stat => stat.userId === userId);

    if (!statistics) {
      return of(null);
    }

    return of(statistics);
  }
}
