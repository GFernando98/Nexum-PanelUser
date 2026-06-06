import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PermissionService } from '../../../../core/services/permission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Permission } from '../../../constants/permissions.enum';



@Component({
    selector: 'app-main-layout',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        ButtonModule,
        AvatarModule,
        TooltipModule,
        MenuModule
    ],
    templateUrl: './main-layout.html'
})
export class MainLayout {
    auth = inject(AuthService);
    permissions = inject(PermissionService);

    collapsed = signal(false);
    darkMode = signal(false);

    Permission = Permission;

    userMenuItems: MenuItem[] = [
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.auth.logout()
        }
    ];

    navItems = [
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            route: '/users',
            permission: Permission.CanViewUsers
        },
        {
            label: 'Roles',
            icon: 'pi pi-shield',
            route: '/roles',
            permission: Permission.CanViewRoles
        }
    ];

    toggleSidebar(): void {
        this.collapsed.update(v => !v);
    }

    toggleDarkMode(): void {
        this.darkMode.update(v => !v);
        if (this.darkMode()) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    get userInitials(): string {
        const user = this.auth.currentUser();
        if (!user) return '?';
        return `${user.fullName.charAt(0)}`.toUpperCase();
    }
}