import { TestBed } from '@angular/core/testing';
import { BookshelvesHttpMockService } from './bookshelves-http-mock-service';
import { Bookshelf } from '../../models/bookshelf';

describe('BookshelvesHttpMockService', () => {
  let service: BookshelvesHttpMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookshelvesHttpMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBookshelvesByUserId', () => {
    it('should return bookshelves for valid user ID', (done) => {
      service.getBookshelvesByUserId(1).subscribe({
        next: (bookshelves: Bookshelf[]) => {
          expect(bookshelves).toBeTruthy();
          expect(Array.isArray(bookshelves)).toBe(true);
          expect(bookshelves.length).toBeGreaterThan(0);
          expect(bookshelves.every(shelf => shelf.userId === 1)).toBe(true);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return bookshelves with correct structure', (done) => {
      service.getBookshelvesByUserId(1).subscribe({
        next: (bookshelves: Bookshelf[]) => {
          const shelf = bookshelves[0];
          expect(shelf.id).toBeDefined();
          expect(shelf.userId).toBeDefined();
          expect(shelf.name).toBeDefined();
          expect(shelf.image).toBeDefined();
          expect(typeof shelf.id).toBe('number');
          expect(typeof shelf.userId).toBe('number');
          expect(typeof shelf.name).toBe('string');
          expect(typeof shelf.image).toBe('string');
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return empty array for user with no bookshelves', (done) => {
      service.getBookshelvesByUserId(999).subscribe({
        next: (bookshelves: Bookshelf[]) => {
          expect(bookshelves).toEqual([]);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should filter bookshelves by userId correctly', (done) => {
      service.getBookshelvesByUserId(1).subscribe({
        next: (shelvesUser1: Bookshelf[]) => {
          service.getBookshelvesByUserId(2).subscribe({
            next: (shelvesUser2: Bookshelf[]) => {
              expect(shelvesUser1.every(shelf => shelf.userId === 1)).toBe(true);
              expect(shelvesUser2.every(shelf => shelf.userId === 2)).toBe(true);
              
              // Ensure they are different sets
              const user1Ids = shelvesUser1.map(s => s.id);
              const user2Ids = shelvesUser2.map(s => s.id);
              const overlap = user1Ids.filter(id => user2Ids.includes(id));
              expect(overlap.length).toBe(0);
              
              done();
            }
          });
        }
      });
    });

    it('should return observable that completes', (done) => {
      let completed = false;
      
      service.getBookshelvesByUserId(1).subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          expect(completed).toBe(true);
          done();
        }
      });
    });

    it('should return consistent results for same user ID', (done) => {
      service.getBookshelvesByUserId(1).subscribe({
        next: (firstCall: Bookshelf[]) => {
          service.getBookshelvesByUserId(1).subscribe({
            next: (secondCall: Bookshelf[]) => {
              expect(firstCall).toEqual(secondCall);
              done();
            }
          });
        }
      });
    });

    it('should handle multiple user IDs', (done) => {
      const userIds = [1, 2];
      let completedCalls = 0;

      userIds.forEach(userId => {
        service.getBookshelvesByUserId(userId).subscribe({
          next: (bookshelves: Bookshelf[]) => {
            expect(bookshelves.every(shelf => shelf.userId === userId)).toBe(true);
            completedCalls++;
            
            if (completedCalls === userIds.length) {
              done();
            }
          }
        });
      });
    });

    it('should return bookshelves with valid data', (done) => {
      service.getBookshelvesByUserId(1).subscribe({
        next: (bookshelves: Bookshelf[]) => {
          bookshelves.forEach(shelf => {
            expect(shelf.id).toBeGreaterThan(0);
            expect(shelf.name.length).toBeGreaterThan(0);
            expect(shelf.image.length).toBeGreaterThan(0);
          });
          done();
        }
      });
    });

    it('should not modify original data on subsequent calls', (done) => {
      service.getBookshelvesByUserId(1).subscribe({
        next: (firstCall: Bookshelf[]) => {
          const firstCallCopy = JSON.parse(JSON.stringify(firstCall));
          
          // Make another call
          service.getBookshelvesByUserId(1).subscribe({
            next: (secondCall: Bookshelf[]) => {
              expect(secondCall).toEqual(firstCallCopy);
              done();
            }
          });
        }
      });
    });
  });
});

