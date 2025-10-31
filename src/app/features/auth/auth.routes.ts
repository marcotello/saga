import { Routes } from '@angular/router';
import { FullScreenLayout } from '../../layout/full-screen-layout/full-screen-layout';

export const authRoutes: Routes = [
    {
        path: '',
        component: FullScreenLayout,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./login/login').then(m => m.Login)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
];
