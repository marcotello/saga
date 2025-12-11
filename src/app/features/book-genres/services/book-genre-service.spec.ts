import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookGenreService } from './book-genre-service';
import { BookGenreHttpMockService } from '../../../core/mock-api/mock-http-services/book-genre-http-mock-service';
import { Genre } from '../models/book-genre-model';
import { of, throwError } from 'rxjs';
import { SuccessEnvelope, ErrorEnvelope } from '../../../core/models/envelope';

describe('BookGenreService', () => {
  let service: BookGenreService;
  let mockBookGenreHttpService: jasmine.SpyObj<BookGenreHttpMockService>;

  const mockGenres: Genre[] = [
    {
      id: 1,
      name: 'Mystery',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      deleted: false
    },
    {
      id: 2,
      name: 'Science Fiction',
      createdAt: '2024-01-02T00:00:00.000Z',
      lastUpdated: '2024-01-02T00:00:00.000Z',
      deleted: false
    },
    {
      id: 3,
      name: 'Romance',
      createdAt: '2024-01-03T00:00:00.000Z',
      lastUpdated: '2024-01-03T00:00:00.000Z',
      deleted: true
    }
  ];

  const mockSuccessResponse: SuccessEnvelope<Genre[]> = {
    status: 'success',
    message: 'Genres retrieved successfully',
    data: mockGenres
  };

  const mockErrorResponse: ErrorEnvelope = {
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An error occurred'
  };

  beforeEach(() => {
    mockBookGenreHttpService = jasmine.createSpyObj('BookGenreHttpMockService', [
      'getAllGenres',
      'addGenre',
      'updateGenreById',
      'deleteGenreById'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BookGenreService,
        { provide: BookGenreHttpMockService, useValue: mockBookGenreHttpService }
      ]
    });

    service = TestBed.inject(BookGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with empty genres array', () => {
      expect(service.genres()).toEqual([]);
    });

    it('should initialize with null error', () => {
      expect(service.error()).toBeNull();
    });

    it('should have filteredGenres computed signal', () => {
      expect(service.filteredGenres).toBeDefined();
    });
  });

  describe('getAllGenres', () => {
    it('should fetch all genres successfully', fakeAsync(() => {
      mockBookGenreHttpService.getAllGenres.and.returnValue(of(mockSuccessResponse));

      service.getAllGenres();
      tick();

      expect(mockBookGenreHttpService.getAllGenres).toHaveBeenCalled();
      expect(service.genres()).toEqual(mockGenres);
      expect(service.error()).toBeNull();
    }));

    it('should handle error when fetching genres fails', fakeAsync(() => {
      mockBookGenreHttpService.getAllGenres.and.returnValue(throwError(() => mockErrorResponse));

      service.getAllGenres();
      tick();

      expect(mockBookGenreHttpService.getAllGenres).toHaveBeenCalled();
      expect(service.error()).toEqual(mockErrorResponse);
    }));

    it('should handle unexpected error format', fakeAsync(() => {
      const unexpectedError = { message: 'Unexpected error' };
      mockBookGenreHttpService.getAllGenres.and.returnValue(throwError(() => unexpectedError));

      service.getAllGenres();
      tick();

      expect(service.error()).toEqual({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      });
    }));

    it('should clear error before making request', fakeAsync(() => {
      service['_error'].set(mockErrorResponse);
      mockBookGenreHttpService.getAllGenres.and.returnValue(of(mockSuccessResponse));

      service.getAllGenres();
      tick();

      expect(service.error()).toBeNull();
    }));
  });

  describe('addGenre', () => {
    it('should add genre successfully', fakeAsync(() => {
      const newGenre: Genre = {
        id: 4,
        name: 'Fantasy',
        createdAt: '2024-01-04T00:00:00.000Z',
        lastUpdated: '2024-01-04T00:00:00.000Z',
        deleted: false
      };

      mockBookGenreHttpService.addGenre.and.returnValue(of(newGenre));
      service['_genres'].set([...mockGenres]);

      service.addGenre('Fantasy');
      tick();

      expect(mockBookGenreHttpService.addGenre).toHaveBeenCalledWith('Fantasy');
      expect(service.genres()).toContain(newGenre);
      expect(service.genres().length).toBe(4);
      expect(service.error()).toBeNull();
    }));

    it('should handle error when adding genre fails', fakeAsync(() => {
      mockBookGenreHttpService.addGenre.and.returnValue(throwError(() => mockErrorResponse));

      service.addGenre('Fantasy');
      tick();

      expect(mockBookGenreHttpService.addGenre).toHaveBeenCalledWith('Fantasy');
      expect(service.error()).toEqual(mockErrorResponse);
    }));

    it('should handle unexpected error format when adding genre', fakeAsync(() => {
      const unexpectedError = { message: 'Unexpected error' };
      mockBookGenreHttpService.addGenre.and.returnValue(throwError(() => unexpectedError));

      service.addGenre('Fantasy');
      tick();

      expect(service.error()).toEqual({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      });
    }));

    it('should clear error before adding genre', fakeAsync(() => {
      service['_error'].set(mockErrorResponse);
      const newGenre: Genre = {
        id: 4,
        name: 'Fantasy',
        createdAt: '2024-01-04T00:00:00.000Z',
        lastUpdated: '2024-01-04T00:00:00.000Z',
        deleted: false
      };

      mockBookGenreHttpService.addGenre.and.returnValue(of(newGenre));

      service.addGenre('Fantasy');
      tick();

      expect(service.error()).toBeNull();
    }));
  });

  describe('updateGenreById', () => {
    it('should update genre successfully', fakeAsync(() => {
      const updatedGenre: Genre = {
        id: 1,
        name: 'Updated Mystery',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdated: '2024-01-05T00:00:00.000Z',
        deleted: false
      };

      const response: SuccessEnvelope<Genre> = {
        status: 'success',
        message: 'Genre updated successfully',
        data: updatedGenre
      };

      mockBookGenreHttpService.updateGenreById.and.returnValue(of(response));
      service['_genres'].set([...mockGenres]);

      service.updateGenreById(1, 'Updated Mystery');
      tick();

      expect(mockBookGenreHttpService.updateGenreById).toHaveBeenCalledWith(1, 'Updated Mystery');
      const updated = service.genres().find(g => g.id === 1);
      expect(updated?.name).toBe('Updated Mystery');
      expect(service.error()).toBeNull();
    }));

    it('should handle error when updating genre fails', fakeAsync(() => {
      mockBookGenreHttpService.updateGenreById.and.returnValue(throwError(() => mockErrorResponse));

      service.updateGenreById(1, 'Updated Mystery');
      tick();

      expect(mockBookGenreHttpService.updateGenreById).toHaveBeenCalledWith(1, 'Updated Mystery');
      expect(service.error()).toEqual(mockErrorResponse);
    }));

    it('should handle unexpected error format when updating genre', fakeAsync(() => {
      const unexpectedError = { message: 'Unexpected error' };
      mockBookGenreHttpService.updateGenreById.and.returnValue(throwError(() => unexpectedError));

      service.updateGenreById(1, 'Updated Mystery');
      tick();

      expect(service.error()).toEqual({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      });
    }));

    it('should clear error before updating genre', fakeAsync(() => {
      service['_error'].set(mockErrorResponse);
      const updatedGenre: Genre = {
        id: 1,
        name: 'Updated Mystery',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdated: '2024-01-05T00:00:00.000Z',
        deleted: false
      };

      const response: SuccessEnvelope<Genre> = {
        status: 'success',
        message: 'Genre updated successfully',
        data: updatedGenre
      };

      mockBookGenreHttpService.updateGenreById.and.returnValue(of(response));

      service.updateGenreById(1, 'Updated Mystery');
      tick();

      expect(service.error()).toBeNull();
    }));

    it('should only update genre with matching id', fakeAsync(() => {
      const updatedGenre: Genre = {
        id: 1,
        name: 'Updated Mystery',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdated: '2024-01-05T00:00:00.000Z',
        deleted: false
      };

      const response: SuccessEnvelope<Genre> = {
        status: 'success',
        message: 'Genre updated successfully',
        data: updatedGenre
      };

      mockBookGenreHttpService.updateGenreById.and.returnValue(of(response));
      service['_genres'].set([...mockGenres]);

      service.updateGenreById(1, 'Updated Mystery');
      tick();

      const genre1 = service.genres().find(g => g.id === 1);
      const genre2 = service.genres().find(g => g.id === 2);
      expect(genre1?.name).toBe('Updated Mystery');
      expect(genre2?.name).toBe('Science Fiction');
    }));
  });

  describe('deleteGenreById', () => {
    it('should delete genre successfully', fakeAsync(() => {
      mockBookGenreHttpService.deleteGenreById.and.returnValue(
        of({ status: 'success', message: 'Genre deleted successfully', data: undefined })
      );
      service['_genres'].set([...mockGenres]);

      service.deleteGenreById(1);
      tick();

      expect(mockBookGenreHttpService.deleteGenreById).toHaveBeenCalledWith(1);
      const deletedGenre = service.genres().find(g => g.id === 1);
      expect(deletedGenre?.deleted).toBe(true);
      expect(deletedGenre?.lastUpdated).toBeDefined();
      expect(service.error()).toBeNull();
    }));

    it('should handle error when deleting genre fails', fakeAsync(() => {
      mockBookGenreHttpService.deleteGenreById.and.returnValue(throwError(() => mockErrorResponse));

      service.deleteGenreById(1);
      tick();

      expect(mockBookGenreHttpService.deleteGenreById).toHaveBeenCalledWith(1);
      expect(service.error()).toEqual(mockErrorResponse);
    }));

    it('should handle unexpected error format when deleting genre', fakeAsync(() => {
      const unexpectedError = { message: 'Unexpected error' };
      mockBookGenreHttpService.deleteGenreById.and.returnValue(throwError(() => unexpectedError));

      service.deleteGenreById(1);
      tick();

      expect(service.error()).toEqual({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      });
    }));

    it('should clear error before deleting genre', fakeAsync(() => {
      service['_error'].set(mockErrorResponse);
      mockBookGenreHttpService.deleteGenreById.and.returnValue(
        of({ status: 'success', message: 'Genre deleted successfully', data: undefined })
      );

      service.deleteGenreById(1);
      tick();

      expect(service.error()).toBeNull();
    }));

    it('should only mark genre as deleted, not remove it', fakeAsync(() => {
      mockBookGenreHttpService.deleteGenreById.and.returnValue(
        of({ status: 'success', message: 'Genre deleted successfully', data: undefined })
      );
      service['_genres'].set([...mockGenres]);

      const initialLength = service.genres().length;
      service.deleteGenreById(1);
      tick();

      expect(service.genres().length).toBe(initialLength);
      const deletedGenre = service.genres().find(g => g.id === 1);
      expect(deletedGenre?.deleted).toBe(true);
    }));
  });

  describe('filteredGenres', () => {
    it('should filter out deleted genres', () => {
      service['_genres'].set([...mockGenres]);

      const filtered = service.filteredGenres();
      expect(filtered.length).toBe(2);
      expect(filtered.every(g => !g.deleted)).toBe(true);
      expect(filtered.find(g => g.id === 3)).toBeUndefined();
    });

    it('should return all genres when none are deleted', () => {
      const nonDeletedGenres = mockGenres.filter(g => !g.deleted);
      service['_genres'].set(nonDeletedGenres);

      const filtered = service.filteredGenres();
      expect(filtered.length).toBe(2);
      expect(filtered).toEqual(nonDeletedGenres);
    });

    it('should return empty array when all genres are deleted', () => {
      const allDeleted = mockGenres.map(g => ({ ...g, deleted: true }));
      service['_genres'].set(allDeleted);

      const filtered = service.filteredGenres();
      expect(filtered.length).toBe(0);
    });
  });

  describe('isErrorEnvelope', () => {
    it('should correctly identify ErrorEnvelope', () => {
      const error: ErrorEnvelope = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Test error'
      };

      const result = service['isErrorEnvelope'](error);
      expect(result).toBe(true);
    });

    it('should return false for non-ErrorEnvelope objects', () => {
      expect(service['isErrorEnvelope']({ message: 'error' })).toBe(false);
      expect(service['isErrorEnvelope']('error')).toBe(false);
      expect(service['isErrorEnvelope'](null)).toBe(false);
      expect(service['isErrorEnvelope'](undefined)).toBe(false);
    });

    it('should return false for objects with wrong status', () => {
      const wrongStatus = {
        status: 'success',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Test error'
      };

      expect(service['isErrorEnvelope'](wrongStatus)).toBe(false);
    });
  });
});

