import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBook } from '../../../core/models/user-book';
import { Bookshelf } from '../../../core/models/bookshelf';
import { BookStatusDirective } from '../../../core/directives/book-status.directive';

@Component({
  selector: 'app-my-shelves',
  imports: [CommonModule, BookStatusDirective],

  templateUrl: './my-shelves.html',
  styleUrl: './my-shelves.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyShelves {
  // Mock Data for Shelves
  readonly shelves = signal<Bookshelf[]>([
    { id: 1, name: 'Favorites', image: '❤️', userId: 1 },
    { id: 2, name: 'To Read', image: '📚', userId: 1 },
    { id: 3, name: 'Sci-Fi', image: '🚀', userId: 1 },
    { id: 4, name: 'History', image: '🏺', userId: 1 },
  ]);

  readonly selectedShelf = signal<Bookshelf>(this.shelves()[0]);

  // Mock Data for Books
  readonly allBooks: UserBook[] = [
    {
      id: 1,
      name: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverImage: 'https://placehold.co/50x70',
      progressPercentage: 100,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-02-20T14:30:00Z',
      userId: 1,
      genreId: 1,
      status: 'Finished',
      shelves: [{ id: 1, name: 'Favorites' }, { id: 4, name: 'History' }]
    },
    {
      id: 2,
      name: '1984',
      author: 'George Orwell',
      coverImage: 'https://placehold.co/50x70',
      progressPercentage: 45,
      createdAt: '2023-03-10T09:15:00Z',
      updatedAt: '2023-03-12T16:45:00Z',
      userId: 1,
      genreId: 2,
      status: 'Reading',
      shelves: [{ id: 1, name: 'Favorites' }, { id: 3, name: 'Sci-Fi' }]
    },
    {
      id: 3,
      name: 'Dune',
      author: 'Frank Herbert',
      coverImage: 'https://placehold.co/50x70',
      progressPercentage: 0,
      createdAt: '2023-04-05T11:20:00Z',
      updatedAt: '2023-04-05T11:20:00Z',
      userId: 1,
      genreId: 2,
      status: 'Want to Read',
      shelves: [{ id: 3, name: 'Sci-Fi' }, { id: 2, name: 'To Read' }]
    },
    {
      id: 4,
      name: 'Sapiens',
      author: 'Yuval Noah Harari',
      coverImage: 'https://placehold.co/50x70',
      progressPercentage: 10,
      createdAt: '2023-05-12T08:30:00Z',
      updatedAt: '2023-05-15T18:00:00Z',
      userId: 1,
      genreId: 3,
      status: 'Reading',
      shelves: [{ id: 4, name: 'History' }]
    }
  ];

  readonly books = computed(() => {
    const currentShelfId = this.selectedShelf().id;
    return this.allBooks.filter(book => book.shelves.some(s => s.id === currentShelfId));
  });

  constructor() { }

  selectShelf(shelf: Bookshelf): void {
    this.selectedShelf.set(shelf);
  }

  createShelf(): void {
    console.log('Create Shelf functionality to be implemented.');
  }

  removeBookFromShelf(book: UserBook): void {
    console.log(`Remove "${book.name}" from "${this.selectedShelf().name}" functionality to be implemented.`);
  }




}
