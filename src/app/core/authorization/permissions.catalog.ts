import { Permission } from './permissions.enum';

export interface PermissionItem {
    id: number;
    name: string;
}

export const Permissions = {
    Items: [
        { id: Permission.CanViewUsers, name: 'Ver usuarios' },
        { id: Permission.CanCreateUsers, name: 'Crear usuarios' },
        { id: Permission.CanEditUsers, name: 'Editar usuarios' },
        { id: Permission.CanDeleteUsers, name: 'Eliminar usuarios' },
        { id: Permission.CanViewRoles, name: 'Ver roles' },
        { id: Permission.CanCreateRoles, name: 'Crear roles' },
        { id: Permission.CanEditRoles, name: 'Editar roles' },
        { id: Permission.CanDeleteRoles, name: 'Eliminar roles' },
        { id: Permission.CanViewCountries, name: 'Ver países' },
        { id: Permission.CanCreateCountries, name: 'Crear países' },
        { id: Permission.CanEditCountries, name: 'Editar países' },
        { id: Permission.CanDeleteCountries, name: 'Eliminar países' },
    ] as PermissionItem[]
};