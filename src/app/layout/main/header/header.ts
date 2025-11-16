import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../features/auth/login/login-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  readonly isLoggedIn = this.loginService.isLoggedIn;
  readonly isMenuVisible = signal(false);

  showMenu(): void {
    this.isMenuVisible.set(true);
  }

  hideMenu(): void {
    this.isMenuVisible.set(false);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/landing']);
  }
}
