import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BooksHttpMockService } from './books-http-mock-service';
import { UserBook } from '../../models/user-book';
import { BookRecommendation } from '../../models/book-recommendation';
import { SearchResultBook } from '../../models/search-result-book';

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

  describe('addBookToShelf', () => {
    const mockSearchBook: SearchResultBook = {
      id: 99,
      name: 'Learning Python',
      author: 'Mark Lutz',
      coverImage: 'images/books/learning-python.jpg',
      description: 'A great Python book',
      status: '',
      shelves: [],
      inLibrary: false,
    };

    it('should create a new UserBook when book is not in library', fakeAsync(() => {
      let result: UserBook | undefined;
      service.addBookToShelf(mockSearchBook, 10, 'Python', 1).subscribe({
        next: (book) => { result = book; }
      });
      tick(300);

      expect(result).toBeTruthy();
      expect(result!.name).toBe('Learning Python');
      expect(result!.author).toBe('Mark Lutz');
      expect(result!.status).toBe('Want to Read');
      expect(result!.progressPercentage).toBe(0);
      expect(result!.shelves).toEqual([{ id: 10, name: 'Python' }]);
      expect(result!.userId).toBe(1);
    }));

    it('should assign a new unique id to the created book', fakeAsync(() => {
      let result: UserBook | undefined;
      service.addBookToShelf(mockSearchBook, 10, 'Python', 1).subscribe({
        next: (book) => { result = book; }
      });
      tick(300);

      expect(result!.id).toBeGreaterThan(0);
    }));

    it('should persist the new book so it appears in getBooksByUserId', fakeAsync(() => {
      service.addBookToShelf(mockSearchBook, 10, 'Python', 1).subscribe();
      tick(300);

      let books: UserBook[] = [];
      service.getBooksByUserId(1).subscribe({
        next: (b) => { books = b; }
      });

      const added = books.find(b => b.name === 'Learning Python');
      expect(added).toBeTruthy();
      expect(added!.shelves).toEqual([{ id: 10, name: 'Python' }]);
    }));

    it('should add shelf to existing book when book is already in library', fakeAsync(() => {
      let existingBooks: UserBook[] = [];
      service.getBooksByUserId(1).subscribe({
        next: (b) => { existingBooks = b; }
      });

      const existingBook = existingBooks[0];
      const searchBook: SearchResultBook = {
        id: existingBook.id,
        name: existingBook.name,
        author: existingBook.author,
        coverImage: existingBook.coverImage,
        description: '',
        status: existingBook.status,
        shelves: existingBook.shelves,
        inLibrary: true,
      };
      const originalShelvesCount = existingBook.shelves.length;

      let result: UserBook | undefined;
      service.addBookToShelf(searchBook, 999, 'New Shelf', 1).subscribe({
        next: (book) => { result = book; }
      });
      tick(300);

      expect(result).toBeTruthy();
      expect(result!.shelves.length).toBe(originalShelvesCount + 1);
      expect(result!.shelves.some(s => s.id === 999 && s.name === 'New Shelf')).toBe(true);
    }));

    it('should not duplicate shelf when adding same shelf to existing book', fakeAsync(() => {
      let existingBooks: UserBook[] = [];
      service.getBooksByUserId(1).subscribe({
        next: (b) => { existingBooks = b; }
      });

      const existingBook = existingBooks[0];
      const existingShelf = existingBook.shelves[0];
      const searchBook: SearchResultBook = {
        id: existingBook.id,
        name: existingBook.name,
        author: existingBook.author,
        coverImage: existingBook.coverImage,
        description: '',
        status: existingBook.status,
        shelves: existingBook.shelves,
        inLibrary: true,
      };
      const originalShelvesCount = existingBook.shelves.length;

      let result: UserBook | undefined;
      service.addBookToShelf(searchBook, existingShelf.id, existingShelf.name, 1).subscribe({
        next: (book) => { result = book; }
      });
      tick(300);

      expect(result!.shelves.length).toBe(originalShelvesCount);
    }));

    it('should complete the observable after emission', fakeAsync(() => {
      let completed = false;
      service.addBookToShelf(mockSearchBook, 10, 'Python', 1).subscribe({
        complete: () => { completed = true; }
      });
      tick(300);

      expect(completed).toBe(true);
    }));
  });

  describe('searchBooks', () => {
    it('should return results matching the query (case-insensitive)', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('angular', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(book =>
        book.name.toLowerCase().includes('angular')
      )).toBe(true);
    }));

    it('should return results with correct structure', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Pro Angular', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      expect(results.length).toBeGreaterThan(0);
      const book = results[0];
      expect(book.id).toBeDefined();
      expect(book.name).toBeDefined();
      expect(book.author).toBeDefined();
      expect(book.coverImage).toBeDefined();
      expect(book.description).toBeDefined();
      expect(book.status).toBeDefined();
      expect(book.shelves).toBeDefined();
      expect(book.inLibrary).toBeDefined();
    }));

    it('should return empty array when no books match', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('xyznonexistentbook', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      expect(results).toEqual([]);
    }));

    it('should perform case-insensitive search', fakeAsync(() => {
      let lowerResults: SearchResultBook[] = [];
      let upperResults: SearchResultBook[] = [];

      service.searchBooks('angular', 1).subscribe({
        next: (books) => { lowerResults = books; }
      });
      tick(500);

      service.searchBooks('ANGULAR', 1).subscribe({
        next: (books) => { upperResults = books; }
      });
      tick(500);

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.map(b => b.id)).toEqual(upperResults.map(b => b.id));
    }));

    it('should mark books in user library as inLibrary true', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Pro Angular', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      const proAngular = results.find(b => b.name === 'Pro Angular');
      expect(proAngular).toBeTruthy();
      expect(proAngular!.inLibrary).toBe(true);
    }));

    it('should mark books not in user library as inLibrary false', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Python', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      const learningPython = results.find(b => b.name === 'Learning Python');
      expect(learningPython).toBeTruthy();
      expect(learningPython!.inLibrary).toBe(false);
    }));

    it('should populate shelves from user books when in library', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Pro Angular', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      const proAngular = results.find(b => b.name === 'Pro Angular');
      expect(proAngular).toBeTruthy();
      expect(proAngular!.shelves.length).toBeGreaterThan(0);
      expect(proAngular!.shelves[0].id).toBeDefined();
      expect(proAngular!.shelves[0].name).toBeDefined();
    }));

    it('should return empty shelves for books not in user library', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Python', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      const learningPython = results.find(b => b.name === 'Learning Python');
      expect(learningPython).toBeTruthy();
      expect(learningPython!.shelves).toEqual([]);
    }));

    it('should populate status from user books when in library', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Pro Angular', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      const proAngular = results.find(b => b.name === 'Pro Angular');
      expect(proAngular).toBeTruthy();
      expect(proAngular!.status).toBe('Reading');
    }));

    it('should return empty status for books not in user library', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Python', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      const learningPython = results.find(b => b.name === 'Learning Python');
      expect(learningPython).toBeTruthy();
      expect(learningPython!.status).toBe('');
    }));

    it('should return different results for different users', fakeAsync(() => {
      let resultsUser1: SearchResultBook[] = [];
      let resultsUser2: SearchResultBook[] = [];

      service.searchBooks('Pro Angular', 1).subscribe({
        next: (books) => { resultsUser1 = books; }
      });
      tick(500);

      service.searchBooks('Pro Angular', 2).subscribe({
        next: (books) => { resultsUser2 = books; }
      });
      tick(500);

      const user1Book = resultsUser1.find(b => b.name === 'Pro Angular');
      const user2Book = resultsUser2.find(b => b.name === 'Pro Angular');

      expect(user1Book!.inLibrary).toBe(true);
      expect(user2Book!.inLibrary).toBe(false);
    }));

    it('should match partial book names', fakeAsync(() => {
      let results: SearchResultBook[] = [];
      service.searchBooks('Angul', 1).subscribe({
        next: (books) => { results = books; }
      });
      tick(500);

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(book =>
        book.name.toLowerCase().includes('angul')
      )).toBe(true);
    }));

    it('should complete the observable after emission', fakeAsync(() => {
      let completed = false;
      service.searchBooks('angular', 1).subscribe({
        complete: () => { completed = true; }
      });
      tick(500);

      expect(completed).toBe(true);
    }));
  });
});

