import { Injectable, inject, signal } from "@angular/core";
import { User } from "../models/user";
import { UserHttpMockService } from "../mock-api/mock-http-services/user-http-mock-service";
import { UserBook } from "../models/user-book";
import { Bookshelf } from "../models/bookshelf";
import { BookRecommendation } from "../models/book-recommendation";
import { UserStatistics } from "../models/user-statistics";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userHttpMockService = inject(UserHttpMockService);

  private readonly _user = signal<User | null>(null);
  private readonly _userBooks = signal<UserBook[] | null>(null);
  private readonly _currentlyReadingUserBooks = signal<UserBook[] | null>(null);
  private readonly _userBookshelves = signal<Bookshelf[] | null>(null);
  private readonly _recommendedBooks = signal<BookRecommendation[] | null>(null);
  private readonly _userStatistics = signal<UserStatistics | null>(null);

  readonly user = this._user.asReadonly();
  readonly userBooks = this._userBooks.asReadonly();
  readonly currentlyReadingUserBooks = this._currentlyReadingUserBooks.asReadonly();
  readonly userBookshelves = this._userBookshelves.asReadonly();
  readonly recommendedBooks = this._recommendedBooks.asReadonly();
  readonly userStatistics = this._userStatistics.asReadonly();

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
      books?.map(book => book.id === updatedBook.id ? updatedBook : book)
        .filter(book => book.status === 'Reading') ?? null
    );
  }

  setUserBookshelves(bookshelves: Bookshelf[] | null): void {
    this._userBookshelves.set(bookshelves);
  }

  addUserBookshelf(bookshelf: Bookshelf): void {
    this._userBookshelves.update(shelves => [...(shelves ?? []), bookshelf]);
  }

  setRecommendedBooks(recommendedBooks: BookRecommendation[] | null): void {
    this._recommendedBooks.set(recommendedBooks);
  }

  getStatisticsByUserId(userId: number): void {
    this.userHttpMockService.getStatisticsByUserId(userId).subscribe({
      next: (statistics: UserStatistics | null) => {
        this._userStatistics.set(statistics);
      },
      error: () => {
        // Error handling will be implemented later with an error service
      }
    });
  }
}
