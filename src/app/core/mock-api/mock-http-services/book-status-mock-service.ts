import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReadingStatus } from '../../models/reading-status';
import readingStatuses from '../mocks-data/reading-statuses.json';

@Injectable({
    providedIn: 'root'
})
export class BookStatusMockService {

    private readonly statuses: ReadingStatus[] = [];

    constructor() {
        this.statuses = [...readingStatuses] as ReadingStatus[];
    }

    getReadingStatuses(): Observable<ReadingStatus[]> {
        return of([...this.statuses]);
    }
}
