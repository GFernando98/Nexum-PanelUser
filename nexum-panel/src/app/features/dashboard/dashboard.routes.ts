import { Routes } from '@angular/router';
import { MainLayout } from '../../shared/components/layout/main-layout/main-layout';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'users',
                loadComponent: () => import('../users/users-list/users-list').then(m => m.UsersList)
            },
            {
                path: 'roles',
                loadComponent: () => import('../roles/roles-list/roles-list').then(m => m.RolesList)
            },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    }
];