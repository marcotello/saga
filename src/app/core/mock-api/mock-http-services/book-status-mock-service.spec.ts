import { TestBed } from '@angular/core/testing';
import { BookStatusMockService } from './book-status-mock-service';
import { ReadingStatus } from '../../models/reading-status';

describe('BookStatusMockService', () => {
  let service: BookStatusMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookStatusMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReadingStatuses', () => {
    it('should return an observable of reading statuses', (done) => {
      service.getReadingStatuses().subscribe({
        next: (statuses: ReadingStatus[]) => {
          expect(statuses).toBeTruthy();
          expect(Array.isArray(statuses)).toBe(true);
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return statuses with correct structure', (done) => {
      service.getReadingStatuses().subscribe({
        next: (statuses: ReadingStatus[]) => {
          expect(statuses.length).toBeGreaterThan(0);
          
          statuses.forEach(status => {
            expect(status.status).toBeDefined();
            expect(typeof status.status).toBe('string');
          });
          
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return expected reading statuses', (done) => {
      service.getReadingStatuses().subscribe({
        next: (statuses: ReadingStatus[]) => {
          const statusValues = statuses.map(s => s.status);
          
          expect(statusValues).toContain('Reading');
          expect(statusValues).toContain('Finished');
          expect(statusValues).toContain('Want to Read');
          
          done();
        },
        error: () => fail('Should not throw error')
      });
    });

    it('should return observable that completes', (done) => {
      let completed = false;
      
      service.getReadingStatuses().subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          expect(completed).toBe(true);
          done();
        }
      });
    });

    it('should return the same statuses on multiple calls', (done) => {
      service.getReadingStatuses().subscribe({
        next: (firstCall: ReadingStatus[]) => {
          service.getReadingStatuses().subscribe({
            next: (secondCall: ReadingStatus[]) => {
              expect(secondCall).toEqual(firstCall);
              done();
            }
          });
        }
      });
    });

    it('should not mutate the original data', (done) => {
      service.getReadingStatuses().subscribe({
        next: (statuses: ReadingStatus[]) => {
          const originalLength = statuses.length;
          statuses.push({ status: 'New Status' });
          
          service.getReadingStatuses().subscribe({
            next: (newStatuses: ReadingStatus[]) => {
              expect(newStatuses.length).toBe(originalLength);
              done();
            }
          });
        }
      });
    });
  });
});
