import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface Shelf {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-my-shelves',
  templateUrl: './my-shelves.html',
  styleUrl: './my-shelves.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyShelves {
  shelves = input.required<Shelf[]>();
  
  shelfClicked = output<Shelf>();
  addShelfClicked = output<void>();

  onShelfClick(shelf: Shelf): void {
    this.shelfClicked.emit(shelf);
  }

  onAddShelfClick(): void {
    this.addShelfClicked.emit();
  }
}

