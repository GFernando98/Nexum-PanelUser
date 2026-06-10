import { Component, inject, signal, computed, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { Permission } from '../../../../core/authorization/permissions.enum';

export interface NavItem {
    label: string;
    icon: string;
    route?: string;
    permission: Permission | null;
    children?: NavItem[];
}

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

    collapsed = signal(false);
    darkMode = signal(false);
    expandedGroups = signal<Set<string>>(new Set());

    Permission = Permission;

    userMenuItems: MenuItem[] = [
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.auth.logout()
        }
    ];

    private allNavItems: NavItem[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            route: '/dashboard',
            permission: null
        },
        {
            label: 'Configuración',
            icon: 'pi pi-cog',
            permission: null,
            children: [
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
            ]
        }
    ];

    visibleNavItems = computed(() => {
        return this.allNavItems
            .map(item => {
                if (item.children) {
                    const visibleChildren = item.children.filter(child =>
                        child.permission === null || this.auth.hasPermission(child.permission)
                    );
                    if (visibleChildren.length === 0) return null;
                    return { ...item, children: visibleChildren };
                }
                if (item.permission !== null && !this.auth.hasPermission(item.permission)) return null;
                return item;
            })
            .filter(Boolean) as NavItem[];
    });

    toggleSidebar(): void {
        this.collapsed.update(v => !v);
    }

    toggleDarkMode(): void {
        this.darkMode.update(v => !v);
        document.documentElement.toggleAttribute('data-theme', this.darkMode());
    }

    toggleGroup(label: string): void {
        const s = new Set(this.expandedGroups());
        s.has(label) ? s.delete(label) : s.add(label);
        this.expandedGroups.set(s);
    }

    isGroupExpanded(label: string): boolean {
        return this.expandedGroups().has(label);
    }

    get userInitials(): string {
        const user = this.auth.currentUser();
        if (!user) return '?';
        return user.fullName.charAt(0).toUpperCase();
    }
}