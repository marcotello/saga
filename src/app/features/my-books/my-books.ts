import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-books',
  imports: [],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBooks {

}
