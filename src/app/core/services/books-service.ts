import { Injectable, inject, signal } from '@angular/core';
import { BooksHttpMockService } from '../mock-api/mock-http-services/books-http-mock-service';
import { BookStatusMockService } from '../mock-api/mock-http-services/book-status-mock-service';
import { UserService } from './user-service';
import { UserBook } from '../models/user-book';
import { BookRecommendation } from '../models/book-recommendation';
import { ReadingStatus } from '../models/reading-status';

@Injectable({
    providedIn: 'root'
})
export class BooksService {
    private readonly booksServiceHttpMock = inject(BooksHttpMockService);
    private readonly bookStatusMockService = inject(BookStatusMockService);
    private readonly userService = inject(UserService);

    private readonly _readingStatuses = signal<ReadingStatus[]>([]);
    readonly readingStatuses = this._readingStatuses.asReadonly();

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
}
