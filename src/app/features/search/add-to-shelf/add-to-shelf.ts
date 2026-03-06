import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Dialog } from '../../../shared/dialog/dialog';
import { SearchResultBook } from '../../../core/models/search-result-book';
import { BooksService } from '../../../core/services/books-service';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-add-to-shelf',
  imports: [Dialog],
  templateUrl: './add-to-shelf.html',
  styleUrl: './add-to-shelf.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToShelf {
  private readonly booksService = inject(BooksService);
  private readonly userService = inject(UserService);

  readonly isDialogOpen = input<boolean>(false);
  readonly book = input<SearchResultBook | null>(null);
  readonly requestClose = output<void>();

  readonly dialogTitle = 'Select a Bookshelf';
  readonly selectedShelfId = signal<number | null>(null);

  readonly bookshelves = computed(() => this.userService.userBookshelves() ?? []);

  closeDialog(): void {
    this.selectedShelfId.set(null);
    this.requestClose.emit();
  }

  onShelfChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedShelfId.set(value ? +value : null);
  }

  onAdd(): void {
    const currentBook = this.book();
    const shelfId = this.selectedShelfId();
    if (!currentBook || !shelfId) return;

    const shelf = this.bookshelves().find(s => s.id === shelfId);
    if (!shelf) return;

    const userId = this.userService.user()?.id ?? 0;
    this.booksService.addBookToShelf(currentBook, shelf.id, shelf.name, userId);
    this.closeDialog();
  }
}
