import { ChangeDetectionStrategy, Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Dialog } from '../dialog/dialog';

@Component({
    selector: 'app-search-book-dialog',
    imports: [FormsModule, Dialog],
    templateUrl: './search-book-dialog.html',
    styleUrl: './search-book-dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookDialog {
    private readonly router = inject(Router);

    readonly isDialogOpen: InputSignal<boolean> = input<boolean>(false);
    readonly requestClose: OutputEmitterRef<void> = output<void>();

    readonly dialogTitle = 'Search for a Book';

    searchQuery = '';

    closeDialog(): void {
        this.searchQuery = '';
        this.requestClose.emit();
    }

    onSearch(): void {
        const query = this.searchQuery.trim();
        if (query) {
            this.router.navigate(['/search-results'], { queryParams: { q: query } });
            this.closeDialog();
        }
    }
}
