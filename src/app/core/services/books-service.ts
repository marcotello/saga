import { Injectable, inject, signal } from '@angular/core';
import { BooksHttpMockService } from '../mock-api/mock-http-services/books-http-mock-service';
import { BookStatusMockService } from '../mock-api/mock-http-services/book-status-mock-service';
import { UserService } from './user-service';
import { UserBook } from '../models/user-book';
import { BookRecommendation } from '../models/book-recommendation';
import { ReadingStatus } from '../models/reading-status';
import { SearchResultBook } from '../models/search-result-book';
import { BookDetail } from '../models/book-detail';

@Injectable({
    providedIn: 'root'
})
export class BooksService {
    private readonly booksServiceHttpMock = inject(BooksHttpMockService);
    private readonly bookStatusMockService = inject(BookStatusMockService);
    private readonly userService = inject(UserService);

    private readonly _readingStatuses = signal<ReadingStatus[]>([]);
    readonly readingStatuses = this._readingStatuses.asReadonly();

    private readonly _searchBooksResult = signal<SearchResultBook[]>([]);
    readonly searchBooksResult = this._searchBooksResult.asReadonly();

    private readonly _isSearching = signal(false);
    readonly isSearching = this._isSearching.asReadonly();

    private readonly _bookDetail = signal<BookDetail | null>(null);
    readonly bookDetail = this._bookDetail.asReadonly();

    private readonly _isLoadingBookDetail = signal(false);
    readonly isLoadingBookDetail = this._isLoadingBookDetail.asReadonly();

    private readonly _bookDetailNotFound = signal(false);
    readonly bookDetailNotFound = this._bookDetailNotFound.asReadonly();

    getBooksByUserId(userId: number): void {
        this.booksServiceHttpMock.getBooksByUserId(userId)
            .subscribe({
                next: (userBooks: UserBook[]) => {
                    this.userService.setUserBooks(userBooks);

                    const readingBooks = userBooks.filter(book => book.status === 'Reading');
                    this.userService.setCurrentlyReadingUserBooks(readingBooks);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    getBooksByBookshelfId(bookshelfId: number, userId: number): void {
        this.booksServiceHttpMock.getBooksByBookshelfId(bookshelfId, userId)
            .subscribe({
                next: (userBooks: UserBook[]) => {
                    this.userService.setUserBooks(userBooks);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    getBooksByStatusUserId(userId: number, status: string): void {
        this.booksServiceHttpMock.getBooksByUserId(userId)
            .subscribe({
                next: (userBooks: UserBook[]) => {
                    this.userService.setUserBooks(userBooks);

                    const readingBooks = userBooks.filter(book => book.status === status);
                    this.userService.setCurrentlyReadingUserBooks(readingBooks);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    getBookRecommendationsByUserId(userId: number): void {
        this.booksServiceHttpMock.getBookRecommendationsByUserId(userId)
            .subscribe({
                next: (recommendations: BookRecommendation[]) => {
                    this.userService.setRecommendedBooks(recommendations);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    updateProgress(book: UserBook, progress: number): void {
        const status = progress === 100 ? 'Finished' : book.status;
        const updatedBook = { ...book, progressPercentage: progress, status };
        this.booksServiceHttpMock.updateBook(updatedBook).subscribe({
            next: (book) => {
                this.userService.updateUserBook(book);
            },
            error: () => {
                // Error handling
            }
        });
    }

    getReadingStatuses(): void {
        this.bookStatusMockService.getReadingStatuses()
            .subscribe({
                next: (statuses: ReadingStatus[]) => {
                    this._readingStatuses.set(statuses);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    searchBooks(query: string, userId: number): void {
        this._isSearching.set(true);
        this._searchBooksResult.set([]);
        this.booksServiceHttpMock.searchBooks(query, userId)
            .subscribe({
                next: (results: SearchResultBook[]) => {
                    this._searchBooksResult.set(results);
                    this._isSearching.set(false);
                },
                error: () => {
                    this._isSearching.set(false);
                }
            });
    }

    getBookDetails(bookId: number, userId: number): void {
        this._isLoadingBookDetail.set(true);
        this._bookDetail.set(null);
        this._bookDetailNotFound.set(false);
        this.booksServiceHttpMock.getBookDetails(bookId, userId)
            .subscribe({
                next: (detail: BookDetail | null) => {
                    if (detail) {
                        this._bookDetail.set(detail);
                    } else {
                        this._bookDetailNotFound.set(true);
                    }
                    this._isLoadingBookDetail.set(false);
                },
                error: () => {
                    this._isLoadingBookDetail.set(false);
                    this._bookDetailNotFound.set(true);
                }
            });
    }

    addBookToShelf(book: SearchResultBook, bookshelfId: number, bookshelfName: string, userId: number): void {
        this.booksServiceHttpMock.addBookToShelf(book, bookshelfId, bookshelfName, userId)
            .subscribe({
                next: (userBook) => {
                    this._searchBooksResult.update(results =>
                        results.map(r => r.id === book.id
                            ? { ...r, inLibrary: true, shelves: [...r.shelves, { id: bookshelfId, name: bookshelfName }] }
                            : r
                        )
                    );

                    const currentDetail = this._bookDetail();
                    if (currentDetail && currentDetail.id === book.id) {
                        this._bookDetail.set({
                            ...currentDetail,
                            inLibrary: true,
                            shelves: [...currentDetail.shelves, { id: bookshelfId, name: bookshelfName }],
                            createdAt: userBook.createdAt ?? new Date().toISOString(),
                            status: userBook.status ?? currentDetail.status,
                        });
                    }

                    this.userService.addUserBook(userBook);
                },
                error: () => {
                }
            });
    }
}
