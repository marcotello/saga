import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserBook } from '../../models/user-book';
import { BookRecommendation } from '../../models/book-recommendation';
import userBooks from '../mocks-data/user-books.json';
import bookSuggestions from '../mocks-data/book-suggestions.json';

@Injectable({
    providedIn: 'root'
})
export class BooksHttpMockService {

    private readonly books: UserBook[] = [];
    private readonly bookRecommendations: BookRecommendation[] = [];

    constructor() {
        this.books = [...userBooks] as UserBook[];
        this.bookRecommendations = [...bookSuggestions] as BookRecommendation[];
    }

    getBooksByUserId(userId: number): Observable<UserBook[]> {
        const books = this.books.filter(book => book.userId === userId);
        return of(books);
    }

    getBooksByBookshelfId(bookshelfId: number, userId: number): Observable<UserBook[]> {
        const books = this.books.filter(book => book.userId === userId && book.shelves.some(shelf => shelf.id === bookshelfId));
        return of(books);
    }

    updateBook(book: UserBook): Observable<UserBook> {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index === -1) {
            return throwError(() => new Error('Book not found'));
        }
        this.books[index] = book;
        return of(book);
    }

    getBookRecommendationsByUserId(userId: number): Observable<BookRecommendation[]> {
        const recommendations = this.bookRecommendations.filter(rec => rec.userId === userId);
        return of(recommendations);
    }

}
