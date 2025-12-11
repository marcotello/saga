import { TestBed } from '@angular/core/testing';
import { BooksHttpMockService } from './books-http-mock-service';
import { UserBook } from '../../models/user-book';
import { BookRecommendation } from '../../models/book-recommendation';

describe('BooksHttpMockService', () => {
  let service: BooksHttpMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksHttpMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBooksByUserId', () => {
    it('should return books for valid user ID', (done) => {
      service.getBooksByUserId(1).subscribe({
        next: (books: UserBook[]) => {
          expect(books).toBeTruthy();
          expect(Array.isArray(books)).toBe(true);
          expect(books.length).toBeGreaterThan(0);
          expect(books.every(book => book.userId === 1)).toBe(true);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return books with correct structure', (done) => {
      service.getBooksByUserId(1).subscribe({
        next: (books: UserBook[]) => {
          const book = books[0];
          expect(book.id).toBeDefined();
          expect(book.userId).toBeDefined();
          expect(book.name).toBeDefined();
          expect(book.author).toBeDefined();
          expect(book.coverImage).toBeDefined();
          expect(book.status).toBeDefined();
          expect(book.progressPercentage).toBeDefined();
          expect(book.genreId).toBeDefined();
          expect(book.shelves).toBeDefined();
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return empty array for user with no books', (done) => {
      service.getBooksByUserId(999).subscribe({
        next: (books: UserBook[]) => {
          expect(books).toEqual([]);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should filter books by userId correctly', (done) => {
      service.getBooksByUserId(1).subscribe({
        next: (booksUser1: UserBook[]) => {
          service.getBooksByUserId(2).subscribe({
            next: (booksUser2: UserBook[]) => {
              expect(booksUser1.every(book => book.userId === 1)).toBe(true);
              expect(booksUser2.every(book => book.userId === 2)).toBe(true);
              done();
            }
          });
        }
      });
    });

    it('should return observable that completes', (done) => {
      let completed = false;
      
      service.getBooksByUserId(1).subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          expect(completed).toBe(true);
          done();
        }
      });
    });
  });

  describe('updateBook', () => {
    let testBook: UserBook;

    beforeEach((done) => {
      service.getBooksByUserId(1).subscribe({
        next: (books: UserBook[]) => {
          testBook = { ...books[0] };
          done();
        }
      });
    });

    it('should update book successfully', (done) => {
      const updatedBook = { ...testBook, progressPercentage: 75 };

      service.updateBook(updatedBook).subscribe({
        next: (book: UserBook) => {
          expect(book).toEqual(updatedBook);
          expect(book.progressPercentage).toBe(75);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should update book status', (done) => {
      const updatedBook = { ...testBook, status: 'Finished' as const };

      service.updateBook(updatedBook).subscribe({
        next: (book: UserBook) => {
          expect(book.status).toBe('Finished');
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should throw error when book is not found', (done) => {
      const nonExistentBook: UserBook = {
        ...testBook,
        id: 99999
      };

      service.updateBook(nonExistentBook).subscribe({
        next: () => fail('Should throw error'),
        error: (error) => {
          expect(error.message).toBe('Book not found');
          done();
        }
      });
    });

    it('should persist book updates', (done) => {
      const updatedBook = { ...testBook, progressPercentage: 90 };

      service.updateBook(updatedBook).subscribe({
        next: () => {
          service.getBooksByUserId(testBook.userId).subscribe({
            next: (books: UserBook[]) => {
              const book = books.find(b => b.id === testBook.id);
              expect(book?.progressPercentage).toBe(90);
              done();
            }
          });
        }
      });
    });

    it('should update multiple fields', (done) => {
      const updatedBook = {
        ...testBook,
        progressPercentage: 80,
        status: 'Reading' as const
      };

      service.updateBook(updatedBook).subscribe({
        next: (book: UserBook) => {
          expect(book.progressPercentage).toBe(80);
          expect(book.status).toBe('Reading');
          done();
        }
      });
    });
  });

  describe('getBookRecommendationsByUserId', () => {
    it('should return recommendations for valid user ID', (done) => {
      service.getBookRecommendationsByUserId(1).subscribe({
        next: (recommendations: BookRecommendation[]) => {
          expect(recommendations).toBeTruthy();
          expect(Array.isArray(recommendations)).toBe(true);
          expect(recommendations.length).toBeGreaterThan(0);
          expect(recommendations.every(rec => rec.userId === 1)).toBe(true);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return recommendations with correct structure', (done) => {
      service.getBookRecommendationsByUserId(1).subscribe({
        next: (recommendations: BookRecommendation[]) => {
          const rec = recommendations[0];
          expect(rec.id).toBeDefined();
          expect(rec.userId).toBeDefined();
          expect(rec.name).toBeDefined();
          expect(rec.author).toBeDefined();
          expect(rec.coverImage).toBeDefined();
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return empty array for user with no recommendations', (done) => {
      service.getBookRecommendationsByUserId(999).subscribe({
        next: (recommendations: BookRecommendation[]) => {
          expect(recommendations).toEqual([]);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should filter recommendations by userId correctly', (done) => {
      service.getBookRecommendationsByUserId(1).subscribe({
        next: (recsUser1: BookRecommendation[]) => {
          service.getBookRecommendationsByUserId(2).subscribe({
            next: (recsUser2: BookRecommendation[]) => {
              expect(recsUser1.every(rec => rec.userId === 1)).toBe(true);
              expect(recsUser2.every(rec => rec.userId === 2)).toBe(true);
              done();
            }
          });
        }
      });
    });

    it('should return observable that completes', (done) => {
      let completed = false;
      
      service.getBookRecommendationsByUserId(1).subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          expect(completed).toBe(true);
          done();
        }
      });
    });
  });
});

