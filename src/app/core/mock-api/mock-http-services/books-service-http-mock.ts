import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserBook } from '../../models/user-book';
import userBooks from '../mocks-data/user-books.json';

@Injectable({
    providedIn: 'root'
})
export class BooksServiceHttpMock {

    private readonly books: UserBook[] = [];

    constructor() {
        this.books = [...userBooks] as UserBook[];
    }

    getBooksByUserId(userId: number): Observable<UserBook[]> {
        const books = this.books.filter(book => book.userId === userId);
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
}
