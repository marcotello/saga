import { Injectable, inject } from '@angular/core';
import { BookshelvesHttpMockService } from '../mock-api/mock-http-services/bookshelves-http-mock-service';
import { UserService } from './user-service';
import { Bookshelf } from '../models/bookshelf';

@Injectable({
    providedIn: 'root'
})
export class BookshelfService {
    private readonly bookshelvesHttpMockService = inject(BookshelvesHttpMockService);
    private readonly userService = inject(UserService);

    getBookshelvesByUserId(userId: number): void {
        this.bookshelvesHttpMockService.getBookshelvesByUserId(userId)
            .subscribe({
                next: (bookshelves: Bookshelf[]) => {
                    this.userService.setUserBookshelves(bookshelves);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    addBookshelf(name: string, image: string, userId: number): void {
        this.bookshelvesHttpMockService.addBookshelf(name, image, userId)
            .subscribe({
                next: (bookshelf: Bookshelf) => {
                    this.userService.addUserBookshelf(bookshelf);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    updateBookshelf(bookshelfId: number, name: string, image: string): void {
        this.bookshelvesHttpMockService.updateBookshelf(bookshelfId, name, image)
            .subscribe({
                next: (bookshelf: Bookshelf) => {
                    this.userService.updateUserBookshelf(bookshelf);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    deleteBookshelf(bookshelfId: number): void {
        this.bookshelvesHttpMockService.deleteBookshelf(bookshelfId)
            .subscribe({
                next: () => {
                    this.userService.deleteUserBookshelf(bookshelfId);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }

    removeBookFromShelf(bookshelfId: number, bookId: number): void {
        this.bookshelvesHttpMockService.removeBookFromShelf(bookshelfId, bookId)
            .subscribe({
                next: () => {
                    this.userService.removeBookFromShelf(bookId);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }
}
