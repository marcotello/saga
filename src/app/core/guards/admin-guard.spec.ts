import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin-guard';
import { LoginService } from '../../features/auth/login/services/login-service';
import { UserService } from '../services/user-service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { signal } from '@angular/core';
import { User } from '../models/user';

describe('adminGuard', () => {
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    const adminUser: User = {
        id: 1,
        username: 'admin',
        name: 'Admin',
        lastName: 'User',
        email: 'admin@saga.com',
        role: '1',
        profilePicture: 'default.jpg'
    };

    const regularUser: User = {
        id: 2,
        username: 'regular',
        name: 'Regular',
        lastName: 'User',
        email: 'regular@saga.com',
        role: '2',
        profilePicture: 'default.jpg'
    };

    beforeEach(() => {
        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = {} as RouterStateSnapshot;
    });

    it('should allow access when user is logged in and is admin', () => {
        const userSignal = signal<User | null>(adminUser);

        TestBed.configureTestingModule({
            providers: [
                { provide: LoginService, useValue: { isLoggedIn: () => true } },
                { provide: UserService, useValue: { user: userSignal.asReadonly() } },
                { provide: Router, useValue: { createUrlTree: () => ({} as UrlTree) } }
            ]
        });

        const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

        expect(result).toBe(true);
    });

    it('should redirect to /landing when user is not logged in', () => {
        const landingUrlTree = { toString: () => '/landing' } as UrlTree;
        const userSignal = signal<User | null>(null);

        TestBed.configureTestingModule({
            providers: [
                { provide: LoginService, useValue: { isLoggedIn: () => false } },
                { provide: UserService, useValue: { user: userSignal.asReadonly() } },
                { provide: Router, useValue: { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue(landingUrlTree) } }
            ]
        });

        const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
        const router = TestBed.inject(Router);

        expect(result).toEqual(landingUrlTree);
        expect(router.createUrlTree).toHaveBeenCalledWith(['/landing']);
    });

    it('should redirect to /dashboard when user is logged in but not admin', () => {
        const dashboardUrlTree = { toString: () => '/dashboard' } as UrlTree;
        const userSignal = signal<User | null>(regularUser);

        TestBed.configureTestingModule({
            providers: [
                { provide: LoginService, useValue: { isLoggedIn: () => true } },
                { provide: UserService, useValue: { user: userSignal.asReadonly() } },
                { provide: Router, useValue: { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue(dashboardUrlTree) } }
            ]
        });

        const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
        const router = TestBed.inject(Router);

        expect(result).toEqual(dashboardUrlTree);
        expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should redirect to /dashboard when user is logged in but user is null', () => {
        const dashboardUrlTree = { toString: () => '/dashboard' } as UrlTree;
        const userSignal = signal<User | null>(null);

        TestBed.configureTestingModule({
            providers: [
                { provide: LoginService, useValue: { isLoggedIn: () => true } },
                { provide: UserService, useValue: { user: userSignal.asReadonly() } },
                { provide: Router, useValue: { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue(dashboardUrlTree) } }
            ]
        });

        const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
        const router = TestBed.inject(Router);

        expect(result).toEqual(dashboardUrlTree);
        expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });
});
