import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../features/auth/login/services/login-service';
import { UserService } from '../services/user-service';

export const adminGuard: CanActivateFn = () => {
    const loginService = inject(LoginService);
    const userService = inject(UserService);
    const router = inject(Router);

    if (!loginService.isLoggedIn()) {
        return router.createUrlTree(['/landing']);
    }

    if (userService.user()?.role === '1') {
        return true;
    }

    return router.createUrlTree(['/dashboard']);
};
