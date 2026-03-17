import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../features/auth/login/services/login-service';

export const authGuard: CanActivateFn = () => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (loginService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/landing']);
};
