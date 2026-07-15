import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
import { Permission } from '../../core/authorization/permissions.enum'; // agregá esto

export const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard').then(m => m.Dashboard)
    },
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
    },
    {
        path: 'professions',
        children: [
            {
                path: '',
                canActivate: [permissionGuard(Permission.CanViewProfessions)],
                loadComponent: () => import('../professions/professions-list/professions-list')
                    .then(m => m.ProfessionsList)
            },
            {
                path: 'create',
                canActivate: [permissionGuard(Permission.CanCreateProfessions)],
                loadComponent: () => import('../professions/professions-form/professions-form')
                    .then(m => m.ProfessionsForm)
            },
            {
                path: 'edit/:id',
                canActivate: [permissionGuard(Permission.CanEditProfessions)],
                loadComponent: () => import('../professions/professions-form/professions-form')
                    .then(m => m.ProfessionsForm)
            }
        ]
    },
    {
        path: 'institutions',
        children: [
            {
                path: '',
                canActivate: [permissionGuard(Permission.CanViewInstitutions)],
                loadComponent: () => import('../institutions/institutions-list/institutions-list')
                    .then(m => m.InstitutionsList)
            },
            {
                path: 'create',
                canActivate: [permissionGuard(Permission.CanCreateInstitutions)],
                loadComponent: () => import('../institutions/institutions-form/institutions-form')
                    .then(m => m.InstitutionsForm)
            },
            {
                path: 'edit/:id',
                canActivate: [permissionGuard(Permission.CanEditInstitutions)],
                loadComponent: () => import('../institutions/institutions-form/institutions-form')
                    .then(m => m.InstitutionsForm)
            }
        ]
    },
    {
        path: 'contact-relationships',
        children: [
            {
                path: '',
                canActivate: [permissionGuard(Permission.CanViewContactRelationships)],
                loadComponent: () => import('../contact-relationships/contact-relationships-list/contact-relationships-list')
                    .then(m => m.ContactRelationshipsList)
            },
            {
                path: 'create',
                canActivate: [permissionGuard(Permission.CanCreateContactRelationships)],
                loadComponent: () => import('../contact-relationships/contact-relationships-form/contact-relationships-form')
                    .then(m => m.ContactRelationshipsForm)
            },
            {
                path: 'edit/:id',
                canActivate: [permissionGuard(Permission.CanEditContactRelationships)],
                loadComponent: () => import('../contact-relationships/contact-relationships-form/contact-relationships-form')
                    .then(m => m.ContactRelationshipsForm)
            }
        ]
    },
    {
        path: 'lead-types',
        children: [
            {
                path: '',
                canActivate: [permissionGuard(Permission.CanViewLeadTypes)],
                loadComponent: () => import('../lead-types/lead-types-list/lead-types-list')
                    .then(m => m.LeadTypesList)
            },
            {
                path: 'create',
                canActivate: [permissionGuard(Permission.CanCreateLeadTypes)],
                loadComponent: () => import('../lead-types/lead-types-form/lead-types-form')
                    .then(m => m.LeadTypesForm)
            },
            {
                path: 'edit/:id',
                canActivate: [permissionGuard(Permission.CanEditLeadTypes)],
                loadComponent: () => import('../lead-types/lead-types-form/lead-types-form')
                    .then(m => m.LeadTypesForm)
            }
        ]
    }
];