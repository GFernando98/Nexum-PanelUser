import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { Permission } from '../constants/permissions.enum';
import { PermissionService } from '../../core/services/permission.service';

@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective implements OnInit {
    @Input() hasPermission!: Permission;

    private templateRef = inject(TemplateRef<unknown>);
    private viewContainer = inject(ViewContainerRef);
    private permissionSvc = inject(PermissionService);

    ngOnInit(): void {
        if (this.permissionSvc.hasPermission(this.hasPermission)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}