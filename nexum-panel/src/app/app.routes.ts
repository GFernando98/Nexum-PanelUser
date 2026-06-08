import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/components/layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
            }
        ]
    },
    { path: '**', redirectTo: 'auth/login' }
];