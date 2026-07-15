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
        { id: Permission.CanViewHistorie, name: 'Ver historial' },
        { id: Permission.CanCreateProfessions, name: 'Crear profesiones' },
        { id: Permission.CanEditProfessions, name: 'Editar profesiones' },
        { id: Permission.CanDeleteProfessions, name: 'Eliminar profesiones' },
        { id: Permission.CanViewProfessions, name: 'Ver profesiones' },
        { id: Permission.CanCreateInstitutions, name: 'Crear instituciones' },
        { id: Permission.CanEditInstitutions, name: 'Editar instituciones' },
        { id: Permission.CanDeleteInstitutions, name: 'Eliminar instituciones' },
        { id: Permission.CanViewInstitutions, name: 'Ver instituciones' },
        { id: Permission.CanCreateContactRelationships, name: 'Crear relación de contacto' },
        { id: Permission.CanEditContactRelationships, name: 'Editar relación de contacto' },
        { id: Permission.CanDeleteContactRelationships, name: 'Eliminar relación de contacto' },
        { id: Permission.CanViewContactRelationships, name: 'Ver relación de contacto' },
        { id: Permission.CanCreateLeadTypes, name: 'Crear clientes potenciales' },
        { id: Permission.CanEditLeadTypes, name: 'Editar clientes potenciales' },
        { id: Permission.CanDeleteLeadTypes, name: 'Eliminar clientes potenciales' },
        { id: Permission.CanViewLeadTypes, name: 'Ver clientes potenciales' },
    ] as PermissionItem[]
};