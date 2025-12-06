import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bookshelf } from '../../models/bookshelf';
import userBookshelves from '../mocks-data/user-bookshelves.json';

@Injectable({
    providedIn: 'root'
})
export class BookshelvesHttpMockService {

    private readonly bookshelves: Bookshelf[] = [];

    constructor() {
        this.bookshelves = [...userBookshelves] as Bookshelf[];
    }

    getBookshelvesByUserId(userId: number): Observable<Bookshelf[]> {
        const bookshelves = this.bookshelves.filter(bookshelf => bookshelf.userId === userId);
        return of(bookshelves);
    }
}
