import {Routes} from '@angular/router';
import {MainLayout} from './layout/main/main-layout/main-layout';

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
                loadComponent: () => import('./features/dashboard/dashboard-view/dashboard-view').then(m => m.DashboardView)
            },
            {
                path: 'genre',
                loadComponent: () => import('./features/book-genres/book-genres').then(m => m.BookGenres)
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
