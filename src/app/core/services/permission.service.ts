import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Permission } from '../../shared/constants/permissions.enum';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private auth = inject(AuthService);

    hasPermission(permission: Permission): boolean {
        const user = this.auth.currentUser();
        if (!user) return false;
        return user.roles.includes('SuperAdmin');
    }

    hasAny(...permissions: Permission[]): boolean {
        return permissions.some(p => this.hasPermission(p));
    }

    hasAll(...permissions: Permission[]): boolean {
        return permissions.every(p => this.hasPermission(p));
    }
}