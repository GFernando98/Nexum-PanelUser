import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
import { Permission } from '../../core/authorization/permissions.enum'; // agregá esto

export const dashboardRoutes: Routes = [
    {
        path: 'users',
        children: [
            {
                path: '',
                canActivate: [permissionGuard(Permission.CanViewUsers)],
                loadComponent: () => import('../users/users-list/users-list')
                    .then(m => m.UsersList)
            },
            {
                path: 'create',
                canActivate: [permissionGuard(Permission.CanCreateUsers)],
                loadComponent: () => import('../users/users-form/users-form')
                    .then(m => m.UsersForm)
            },
            {
                path: 'edit/:id',
                canActivate: [permissionGuard(Permission.CanEditUsers)],
                loadComponent: () => import('../users/users-form/users-form')
                    .then(m => m.UsersForm)
            }
        ]
    },
    {
        path: 'roles',
        children: [
            {
                path: '',
                canActivate: [permissionGuard(Permission.CanViewRoles)],
                loadComponent: () => import('../roles/roles-list/roles-list')
                    .then(m => m.RolesList)
            },
            {
                path: 'create',
                canActivate: [permissionGuard(Permission.CanCreateRoles)],
                loadComponent: () => import('../roles/roles-form/roles-form')
                    .then(m => m.RolesForm)
            },
            {
                path: 'edit/:id',
                canActivate: [permissionGuard(Permission.CanEditRoles)],
                loadComponent: () => import('../roles/roles-form/roles-form')
                    .then(m => m.RolesForm)
            }
        ]
    }
];