import { Injectable, signal, inject, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { Genre } from './book-genre-models';
import { BookGenreHttpMockService } from './book-genre-http-mock-service';
import { ErrorEnvelope } from '../../core/models/envelope';

@Injectable({
  providedIn: 'root'
})
export class BookGenreService {
  private readonly bookGenreHttpMockService = inject(BookGenreHttpMockService);
  private subscription: Subscription | null = null;

  private readonly _genres = signal<Genre[]>([]);
  private readonly _error = signal<ErrorEnvelope | null>(null);

  readonly genres = this._genres.asReadonly();
  readonly error = this._error.asReadonly();

  readonly filteredGenres = computed(() => {
    return this._genres().filter(genre => !genre.deleted);
  });

  getAllGenres(): void {
    this._error.set(null);

    this.subscription = this.bookGenreHttpMockService.getAllGenres().subscribe({
      next: (response) => {
        this._genres.set(response.data);
      },
      error: (error: unknown) => {
        if (this.isErrorEnvelope(error)) {
          this._error.set(error);
        } else {
          this._error.set({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
          });
        }
      }
    });
  }

  addGenre(name: string): void {
    this._error.set(null);

    this.subscription = this.bookGenreHttpMockService.addGenre(name).subscribe({
      next: (response) => {
        this._genres.update(genres => [...genres, response.data]);
      },
      error: (error: unknown) => {
        if (this.isErrorEnvelope(error)) {
          this._error.set(error);
        } else {
          this._error.set({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
          });
        }
      }
    });
  }

  updateGenreById(id: number, name: string): void {
    this._error.set(null);

    this.subscription = this.bookGenreHttpMockService.updateGenreById(id, name).subscribe({
      next: (response) => {
        this._genres.update(genres => 
          genres.map(genre => genre.id === id ? response.data : genre)
        );
      },
      error: (error: unknown) => {
        if (this.isErrorEnvelope(error)) {
          this._error.set(error);
        } else {
          this._error.set({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
          });
        }
      }
    });
  }

  deleteGenreById(id: number): void {
    this._error.set(null);

    this.subscription = this.bookGenreHttpMockService.deleteGenreById(id).subscribe({
      next: () => {
        this._genres.update(genres => 
          genres.map(genre => 
            genre.id === id ? { ...genre, deleted: true, lastUpdated: new Date().toISOString() } : genre
          )
        );
      },
      error: (error: unknown) => {
        if (this.isErrorEnvelope(error)) {
          this._error.set(error);
        } else {
          this._error.set({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
          });
        }
      }
    });
  }

  private isErrorEnvelope(error: unknown): error is ErrorEnvelope {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'code' in error &&
      'message' in error &&
      (error as ErrorEnvelope).status === 'error'
    );
  }
}

