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
          }
        ]
      },
      {
        path: '**',
        redirectTo: '/landing'
      }
];
