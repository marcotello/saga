import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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

    addBookshelf(name: string, image: string, userId: number): Observable<Bookshelf> {
        const maxId = this.bookshelves.length > 0
            ? Math.max(...this.bookshelves.map(b => b.id))
            : 0;

        const newBookshelf: Bookshelf = {
            id: maxId + 1,
            name: name.trim(),
            image: image.trim(),
            userId
        };

        this.bookshelves.push(newBookshelf);

        return of(newBookshelf).pipe(delay(300));
    }

    updateBookshelf(bookshelfId: number, name: string, image: string): Observable<Bookshelf> {
        const bookshelf = this.bookshelves.find(b => b.id === bookshelfId);

        if (!bookshelf) {
            throw new Error(`Bookshelf with id ${bookshelfId} not found`);
        }

        bookshelf.name = name.trim();
        bookshelf.image = image.trim();

        return of({ ...bookshelf }).pipe(delay(300));
    }

    removeBookFromShelf(bookshelfId: number, bookId: number): Observable<void> {
        return of(undefined).pipe(delay(300));
    }
}
