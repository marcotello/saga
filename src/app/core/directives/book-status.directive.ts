import { Directive, HostBinding, input } from '@angular/core';

@Directive({
    selector: '[appBookStatus]',
    standalone: true
})
export class BookStatusDirective {
    status = input<string>('', { alias: 'appBookStatus' });

    @HostBinding('class')
    get elementClass(): string {
        const statusClass = this.getStatusClass(this.status());
        return `status-badge ${statusClass}`.trim();
    }

    private getStatusClass(status: string): string {
        switch (status) {
            case 'Want to Read': return 'status-want-to-read';
            case 'Reading': return 'status-reading';
            case 'Finished': return 'status-finished';
            case 'Save it for later': return 'status-save-it-for-later';
            default: return '';
        }
    }
}
