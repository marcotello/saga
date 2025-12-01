import { Injectable, inject } from '@angular/core';
import { BooksServiceHttpMock } from '../mock-api/mock-http-services/books-service-http-mock';
import { UserService } from './user-service';
import { UserBook } from '../models/user-book';

@Injectable({
    providedIn: 'root'
})
export class BooksService {
    private readonly booksServiceHttpMock = inject(BooksServiceHttpMock);
    private readonly userService = inject(UserService);

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

    updateProgress(book: UserBook, progress: number): void {
        const updatedBook = { ...book, progressPercentage: progress };
        this.booksServiceHttpMock.updateBook(updatedBook).subscribe({
            next: (book) => {
                this.userService.updateUserBook(book);
            },
            error: () => {
                // Error handling
            }
        });
    }
}
