import { Routes } from '@angular/router';
import { MainLayout } from './layout/main/main-layout/main-layout';

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
                loadComponent: () => import('./features/dashboard/components/dashboard-view/dashboard-view').then(m => m.DashboardView)
            },
            {
                path: 'genres',
                loadComponent: () => import('./features/book-genres/book-genres/book-genres').then(m => m.BookGenres)
            },
            {
                path: 'my-books',
                loadComponent: () => import('./features/my-books/my-books').then(m => m.MyBooks)
            },
            {
                path: 'my-shelves',
                loadComponent: () => import('./features/my-shelves/my-shelves/my-shelves').then(m => m.MyShelves)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile/profile').then(m => m.Profile)
            },
            {
                path: 'account',
                loadComponent: () => import('./features/account/account/account').then(m => m.Account)
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
