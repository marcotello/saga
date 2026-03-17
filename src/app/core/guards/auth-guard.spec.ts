import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { LoginService } from '../../features/auth/login/services/login-service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

describe('authGuard', () => {
    let mockLoginService: jasmine.SpyObj<LoginService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        mockLoginService = jasmine.createSpyObj('LoginService', [], {
            isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false)
        });

        mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);
        mockRouter.createUrlTree.and.returnValue({} as UrlTree);

        TestBed.configureTestingModule({
            providers: [
                { provide: LoginService, useValue: mockLoginService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = {} as RouterStateSnapshot;
    });

    it('should allow access when user is logged in', () => {
        (Object.getOwnPropertyDescriptor(mockLoginService, 'isLoggedIn')?.get as jasmine.Spy)?.and.returnValue(true);
        (mockLoginService as any).isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);

        TestBed.overrideProvider(LoginService, {
            useValue: { isLoggedIn: () => true }
        });

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBe(true);
    });

    it('should redirect to /landing when user is not logged in', () => {
        const landingUrlTree = {} as UrlTree;

        TestBed.overrideProvider(LoginService, {
            useValue: { isLoggedIn: () => false }
        });
        TestBed.overrideProvider(Router, {
            useValue: { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue(landingUrlTree) }
        });

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toEqual(landingUrlTree);
    });

    it('should redirect to /landing with correct path', () => {
        const mockRouterInstance = { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree) };

        TestBed.overrideProvider(LoginService, {
            useValue: { isLoggedIn: () => false }
        });
        TestBed.overrideProvider(Router, {
            useValue: mockRouterInstance
        });

        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(mockRouterInstance.createUrlTree).toHaveBeenCalledWith(['/landing']);
    });
});
