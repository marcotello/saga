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
  // TODO: Replace with actual auth service when available
  isLoggedIn = signal<boolean>(false);

  handleLogout(): void {
    // TODO: Implement logout logic when auth service is available
    this.isLoggedIn.set(false);
  }
}
