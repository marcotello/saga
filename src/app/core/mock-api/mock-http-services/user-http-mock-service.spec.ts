import { TestBed } from '@angular/core/testing';
import { UserHttpMockService } from './user-http-mock-service';
import { User } from '../../models/user';
import { UserStatistics } from '../../models/user-statistics';

describe('UserHttpMockService', () => {
  let service: UserHttpMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHttpMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return user data when credentials are valid (email)', (done) => {
      service.login('johnsmith@saga.com', 'Password@123').subscribe({
        next: (response) => {
          expect(response.status).toBe('success');
          expect(response.message).toBe('Login successful');
          expect(response.data.user.email).toBe('johnsmith@saga.com');
          expect(response.data.accessToken).toContain('mock-token-');
          expect(response.data.tokenType).toBe('Bearer');
          expect(response.data.expiresIn).toBe(3600);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return user data when credentials are valid (username)', (done) => {
      service.login('johnsmith', 'Password@123').subscribe({
        next: (response) => {
          expect(response.status).toBe('success');
          expect(response.data.user.username).toBe('johnsmith');
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should throw error when email is invalid', (done) => {
      service.login('invalid@example.com', 'password123').subscribe({
        next: () => fail('Should throw error'),
        error: (error) => {
          expect(error.status).toBe('error');
          expect(error.code).toBe('INVALID_CREDENTIALS');
          expect(error.message).toBe('Invalid email or password');
          done();
        }
      });
    });

    it('should throw error when password is invalid', (done) => {
      service.login('john.doe@example.com', 'wrongpassword').subscribe({
        next: () => fail('Should throw error'),
        error: (error) => {
          expect(error.status).toBe('error');
          expect(error.code).toBe('INVALID_CREDENTIALS');
          done();
        }
      });
    });
  });

  describe('updateProfileById', () => {
    it('should update user profile successfully', (done) => {
      const updatedFields: Partial<User> = {
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      };

      service.updateProfileById(1, updatedFields).subscribe({
        next: (user) => {
          expect(user.name).toBe('Jane');
          expect(user.lastName).toBe('Smith');
          expect(user.email).toBe('jane.smith@example.com');
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should update bio field', (done) => {
      const updatedFields: Partial<User> = {
        bio: 'New bio text'
      };

      service.updateProfileById(1, updatedFields).subscribe({
        next: (user) => {
          expect(user.bio).toBe('New bio text');
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should handle empty bio', (done) => {
      const updatedFields: Partial<User> = {
        bio: ''
      };

      service.updateProfileById(1, updatedFields).subscribe({
        next: (user) => {
          // Empty string bio is converted to null in the response
          expect(user.bio).toBeNull();
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should throw error when user is not found', (done) => {
      service.updateProfileById(999, { name: 'Test' }).subscribe({
        next: () => fail('Should throw error'),
        error: (error) => {
          expect(error.status).toBe('error');
          expect(error.code).toBe('INTERNAL_SERVER_ERROR');
          expect(error.message).toBe('User not found');
          done();
        }
      });
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', (done) => {
      const payload = {
        currentPassword: 'password123',
        newPassword: 'newpassword456'
      };

      service.updatePassword(1, payload).subscribe({
        next: (user) => {
          expect(user).toBeTruthy();
          expect(user.id).toBe(1);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should throw error when user is not found', (done) => {
      const payload = {
        currentPassword: 'password123',
        newPassword: 'newpassword456'
      };

      service.updatePassword(999, payload).subscribe({
        next: () => fail('Should throw error'),
        error: (error) => {
          expect(error.status).toBe('error');
          expect(error.code).toBe('INTERNAL_SERVER_ERROR');
          expect(error.message).toBe('User not found');
          done();
        }
      });
    });
  });

  describe('getStatisticsByUserId', () => {
    it('should return statistics for valid user ID', (done) => {
      service.getStatisticsByUserId(1).subscribe({
        next: (statistics: UserStatistics | null) => {
          expect(statistics).toBeTruthy();
          expect(statistics?.userId).toBe(1);
          expect(statistics?.readBooks).toBeDefined();
          expect(statistics?.totalPages).toBeDefined();
          expect(statistics?.monthlyBooks).toBeDefined();
          expect(statistics?.monthlyBooks.length).toBe(12);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return statistics with correct structure', (done) => {
      service.getStatisticsByUserId(1).subscribe({
        next: (statistics: UserStatistics | null) => {
          expect(statistics?.monthlyBooks[0].month).toBeDefined();
          expect(statistics?.monthlyBooks[0].booksRead).toBeDefined();
          expect(typeof statistics?.monthlyBooks[0].booksRead).toBe('number');
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return null for non-existent user ID', (done) => {
      service.getStatisticsByUserId(999).subscribe({
        next: (statistics: UserStatistics | null) => {
          expect(statistics).toBeNull();
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return different statistics for different users', (done) => {
      let stats1: UserStatistics | null;
      
      service.getStatisticsByUserId(1).subscribe({
        next: (statistics) => {
          stats1 = statistics;
          
          service.getStatisticsByUserId(2).subscribe({
            next: (stats2) => {
              expect(stats1?.userId).toBe(1);
              expect(stats2?.userId).toBe(2);
              expect(stats1?.readBooks).not.toBe(stats2?.readBooks);
              done();
            }
          });
        }
      });
    });
  });
});

