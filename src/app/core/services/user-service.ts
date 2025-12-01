import { Injectable, inject, signal } from "@angular/core";
import { User } from "../models/models";
import { UserHttpMockService } from "../mock-api/mock-http-services/user-http-mock-service";
import { UserBook } from "../models/user-book";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userHttpMockService = inject(UserHttpMockService);

  private readonly _user = signal<User | null>(null);
  private readonly _userBooks = signal<UserBook[] | null>(null);
  private readonly _currentlyReadingUserBooks = signal<UserBook[] | null>(null);

  readonly user = this._user.asReadonly();
  readonly userBooks = this._userBooks.asReadonly();
  readonly currentlyReadingUserBooks = this._currentlyReadingUserBooks.asReadonly();

  setUser(user: User | null): void {
    this._user.set(user);
  }

  updateProfileById(user: User): void {
    this.userHttpMockService.updateProfileById(user.id, user).subscribe({
      next: (updatedUser: User) => {
        this._user.set(updatedUser);
      },
      error: () => {
        // Error handling will be implemented later with an error service
      }
    });
  }

  updatePassword(userId: number, currentPassword: string, newPassword: string): void {
    this.userHttpMockService.updatePassword(userId, { currentPassword, newPassword }).subscribe({
      next: (updatedUser: User) => {
        this._user.set(updatedUser);
      },
      error: () => {
        // Error handling will be implemented later with an error service
      }
    });
  }

  setUserBooks(userBooks: UserBook[] | null): void {
    this._userBooks.set(userBooks);
  }

  setCurrentlyReadingUserBooks(currentlyReadingUserBooks: UserBook[] | null): void {
    this._currentlyReadingUserBooks.set(currentlyReadingUserBooks);
  }

  updateUserBook(updatedBook: UserBook): void {
    this._userBooks.update(books =>
      books?.map(book => book.id === updatedBook.id ? updatedBook : book) ?? null
    );

    this._currentlyReadingUserBooks.update(books =>
      books?.map(book => book.id === updatedBook.id ? updatedBook : book) ?? null
    );
  }
}