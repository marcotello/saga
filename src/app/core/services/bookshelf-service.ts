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

    getBookshelvesUserId(userId: number): void {
        this.bookshelvesHttpMockService.getBookshelvesUserId(userId)
            .subscribe({
                next: (bookshelves: Bookshelf[]) => {
                    this.userService.setUserBookshelves(bookshelves);
                },
                error: () => {
                    // Error handling will be implemented later with an error service
                }
            });
    }
}
