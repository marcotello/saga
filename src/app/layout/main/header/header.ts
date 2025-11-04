import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  // Signal to track authentication state
  isLoggedIn = signal(false);

  // Method to handle logout
  logout(): void {
    this.isLoggedIn.set(false);
    // TODO: Add actual logout logic when authentication service is implemented
  }
}
