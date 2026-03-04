import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInput {
  private readonly router = inject(Router);

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();
    if (query) {
      this.router.navigate(['/search-results'], { queryParams: { q: query } });
    }
  }
}
