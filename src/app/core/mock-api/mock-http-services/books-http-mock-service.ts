import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { UserBook } from '../../models/user-book';
import { BookRecommendation } from '../../models/book-recommendation';
import { SearchResultBook } from '../../models/search-result-book';
import { BookDetail } from '../../models/book-detail';
import userBooks from '../mocks-data/user-books.json';
import bookSuggestions from '../mocks-data/book-suggestions.json';
import booksData from '../mocks-data/books.json';

interface BookCatalogEntry {
    id: number;
    name: string;
    author: string;
    coverImage: string;
    description: string;
    pages: number;
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

    addBookToShelf(book: SearchResultBook, bookshelfId: number, bookshelfName: string, userId: number): Observable<UserBook> {
        const existing = this.books.find(b => b.name === book.name && b.userId === userId);

        if (existing) {
            const alreadyOnShelf = existing.shelves.some(s => s.id === bookshelfId);
            if (!alreadyOnShelf) {
                existing.shelves.push({ id: bookshelfId, name: bookshelfName });
            }
            return of({ ...existing }).pipe(delay(300));
        }

        const maxId = this.books.length > 0
            ? Math.max(...this.books.map(b => b.id))
            : 0;

        const newUserBook: UserBook = {
            id: maxId + 1,
            name: book.name,
            author: book.author,
            coverImage: book.coverImage,
            progressPercentage: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId,
            genreId: 0,
            status: 'Want to Read',
            shelves: [{ id: bookshelfId, name: bookshelfName }],
        };

        this.books.push(newUserBook);
        return of(newUserBook).pipe(delay(300));
    }

    getBookDetails(bookId: number, userId: number): Observable<BookDetail | null> {
        const catalogEntry = this.bookCatalog.find(b => b.id === bookId);
        if (!catalogEntry) {
            return of(null).pipe(delay(300));
        }

        const userBook = this.books.find(
            ub => ub.name === catalogEntry.name && ub.userId === userId
        );

        const bookDetail: BookDetail = {
            id: catalogEntry.id,
            name: catalogEntry.name,
            author: catalogEntry.author,
            coverImage: catalogEntry.coverImage,
            description: catalogEntry.description,
            pages: catalogEntry.pages,
            progressPercentage: userBook?.progressPercentage ?? 0,
            createdAt: userBook?.createdAt ?? '',
            updatedAt: userBook?.updatedAt ?? '',
            status: userBook?.status ?? '',
            shelves: userBook?.shelves ?? [],
            inLibrary: !!userBook,
        };

        return of(bookDetail).pipe(delay(500));
    }

}
