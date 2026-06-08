import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleDto, RolesService } from '../../../core/services/role.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    HasPermissionDirective
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss'
})
export class RolesList implements OnInit {
  private rolesService = inject(RolesService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);
  private message = inject(MessageService);

  Permission = Permission;

  roles = signal<RoleDto[]>([]);
  loading = signal(true);
  totalRecords = signal(0);
  pageSize = 10;
  search = '';

  ngOnInit(): void {
    this.load();
  }

  load(pageNumber = 1): void {
    this.loading.set(true);
    this.rolesService.getAll({ pageNumber, pageSize: this.pageSize, parameter: this.search || undefined }).subscribe({
      next: res => {
        this.roles.set(res.data);
        this.totalRecords.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles.' });
        this.loading.set(false);
      }
    });
  }

  onSearch(): void { this.load(1); }

  onPageChange(event: any): void {
    this.pageSize = event.rows;
    this.load(event.first / event.rows + 1);
  }

  goToCreate(): void { this.router.navigate(['/roles/create']); }
  goToEdit(id: string): void { this.router.navigate(['/roles/edit', id]); }

  confirmDelete(role: RoleDto): void {
    this.confirmation.confirm({
      message: `¿Estás seguro de eliminar el rol <b>${role.name}</b>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.rolesService.delete(role.id).subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado.' });
          this.load();
        },
        error: err => this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'Error al eliminar.' })
      })
    });
  }
}