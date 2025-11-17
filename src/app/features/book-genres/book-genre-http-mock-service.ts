import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import genresData from '../../mocks/genres.json';
import { Genre } from './book-genre-models';
import { SuccessEnvelope, ErrorEnvelope } from '../../core/models/envelope';

@Injectable({
  providedIn: 'root',
})
export class BookGenreHttpMockService {
  private genres: Genre[] = [];

  constructor() {
    this.genres = [...genresData] as Genre[];
  }

  getAllGenres(): Observable<SuccessEnvelope<Genre[]>> {
    const nonDeletedGenres = this.genres.filter(genre => !genre.deleted);
    const envelope: SuccessEnvelope<Genre[]> = {
      status: 'success',
      message: 'Genres retrieved successfully',
      data: nonDeletedGenres
    };
    return of(envelope).pipe(delay(300));
  }

  addGenre(name: string): Observable<SuccessEnvelope<Genre>> {
    if (name.toLowerCase().includes('error')) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Genre name cannot contain the word "error"'
      };
      return throwError(() => error);
    }

    const maxId = this.genres.length > 0 
      ? Math.max(...this.genres.map(g => g.id))
      : 0;
    
    const newGenre: Genre = {
      id: maxId + 1,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      deleted: false
    };

    this.genres.push(newGenre);

    const envelope: SuccessEnvelope<Genre> = {
      status: 'success',
      message: 'Genre added successfully',
      data: newGenre
    };
    return of(envelope).pipe(delay(300));
  }

  updateGenreById(id: number, name: string): Observable<SuccessEnvelope<Genre>> {
    if (name.toLowerCase().includes('error')) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Genre name cannot contain the word "error"'
      };
      return throwError(() => error);
    }

    const genreIndex = this.genres.findIndex(g => g.id === id && !g.deleted);
    
    if (genreIndex === -1) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Genre not found'
      };
      return throwError(() => error);
    }

    const updatedGenre: Genre = {
      ...this.genres[genreIndex],
      name: name.trim(),
      lastUpdated: new Date().toISOString()
    };

    this.genres[genreIndex] = updatedGenre;

    const envelope: SuccessEnvelope<Genre> = {
      status: 'success',
      message: 'Genre updated successfully',
      data: updatedGenre
    };
    return of(envelope).pipe(delay(300));
  }

  deleteGenreById(id: number): Observable<SuccessEnvelope<void>> {
    const genreIndex = this.genres.findIndex(g => g.id === id && !g.deleted);
    
    if (genreIndex === -1) {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Genre not found'
      };
      return throwError(() => error);
    }

    this.genres[genreIndex] = {
      ...this.genres[genreIndex],
      deleted: true,
      lastUpdated: new Date().toISOString()
    };

    const envelope: SuccessEnvelope<void> = {
      status: 'success',
      message: 'Genre deleted successfully',
      data: undefined
    };
    return of(envelope).pipe(delay(300));
  }
}

