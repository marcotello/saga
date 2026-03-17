import { Routes } from '@angular/router';
import { MainLayout } from './layout/main/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/landing',
        pathMatch: 'full'
    },
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'landing',
                loadComponent: () => import('./features/landing/landing').then(m => m.Landing)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/components/dashboard-view/dashboard-view').then(m => m.DashboardView),
                canActivate: [authGuard]
            },
            {
                path: 'genres',
                loadComponent: () => import('./features/book-genres/book-genres/book-genres').then(m => m.BookGenres),
                canActivate: [adminGuard]
            },
            {
                path: 'my-books',
                loadComponent: () => import('./features/my-books/my-books').then(m => m.MyBooks),
                canActivate: [authGuard]
            },
            {
                path: 'my-bookshelves',
                loadComponent: () => import('./features/my-bookshelves/my-bookshelves/my-bookshelves').then(m => m.MyBookShelves),
                canActivate: [authGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile/profile').then(m => m.Profile),
                canActivate: [authGuard]
            },
            {
                path: 'account',
                loadComponent: () => import('./features/account/account/account').then(m => m.Account),
                canActivate: [authGuard]
            },
            {
                path: 'search-results',
                loadComponent: () => import('./features/search/search-results/search-results').then(m => m.SearchResults),
                canActivate: [authGuard]
            },
            {
                path: 'book-details/:id',
                loadComponent: () => import('./features/book-deatils/book-deatils').then(m => m.BookDeatils),
                canActivate: [authGuard]
            },
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: '**',
        redirectTo: '/landing'
    }
];
