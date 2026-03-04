import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { UserBook } from '../../models/user-book';
import { BookRecommendation } from '../../models/book-recommendation';
import { SearchResultBook } from '../../models/search-result-book';
import userBooks from '../mocks-data/user-books.json';
import bookSuggestions from '../mocks-data/book-suggestions.json';
import booksData from '../mocks-data/books.json';

interface BookCatalogEntry {
    id: number;
    name: string;
    author: string;
    coverImage: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class BooksHttpMockService {

    private readonly books: UserBook[] = [];
    private readonly bookRecommendations: BookRecommendation[] = [];
    private readonly bookCatalog: BookCatalogEntry[] = [];

    constructor() {
        this.books = [...userBooks] as UserBook[];
        this.bookRecommendations = [...bookSuggestions] as BookRecommendation[];
        this.bookCatalog = [...booksData] as BookCatalogEntry[];
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

    searchBooks(query: string, userId: number): Observable<SearchResultBook[]> {
        const normalizedQuery = query.toLowerCase();
        const matchedBooks = this.bookCatalog.filter(book =>
            book.name.toLowerCase().includes(normalizedQuery)
        );

        const userBooksForUser = this.books.filter(ub => ub.userId === userId);

        const results: SearchResultBook[] = matchedBooks.map(book => {
            const userBook = userBooksForUser.find(ub => ub.name === book.name);
            return {
                id: book.id,
                name: book.name,
                author: book.author,
                coverImage: book.coverImage,
                description: book.description,
                status: userBook?.status ?? '',
                shelves: userBook?.shelves ?? [],
                inLibrary: !!userBook,
            };
        });

        return of(results).pipe(delay(500));
    }

}
