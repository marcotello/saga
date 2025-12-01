import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserBook } from '../../models/user-book';
import userBooks from '../mocks-data/user-books.json';

@Injectable({
    providedIn: 'root'
})
export class BooksServiceHttpMock {

    getBooksByUserId(userId: number): Observable<UserBook[]> {
        const books = (userBooks as UserBook[]).filter(book => book.userId === userId);
        return of(books);
    }
}
