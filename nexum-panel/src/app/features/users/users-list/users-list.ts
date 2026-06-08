import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserDto, UsersService } from '../../../core/services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    HasPermissionDirective
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss']
})
export class UsersList implements OnInit {
  private usersService = inject(UsersService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);
  private message = inject(MessageService);

  Permission = Permission;

  users = signal<UserDto[]>([]);
  loading = signal(true);
  totalRecords = signal(0);
  pageSize = 10;
  search = '';

  ngOnInit(): void {
    this.load();
  }

  load(pageNumber = 1): void {
    this.loading.set(true);
    this.usersService.getAll({
      pageNumber,
      pageSize: this.pageSize,
      parameter: this.search || undefined
    }).subscribe({
      next: res => {
        this.users.set(res.data);
        this.totalRecords.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios.' });
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.load(1);
  }

  onPageChange(event: any): void {
    const page = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.load(page);
  }

  goToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  confirmDelete(user: UserDto): void {
    this.confirmation.confirm({
      message: `¿Estás seguro de eliminar a <b>${user.firstName} ${user.lastName}</b>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(user.id)
    });
  }

  private delete(id: string): void {
    this.usersService.delete(id).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado.' });
        this.load();
      },
      error: err => {
        this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'Error al eliminar.' });
      }
    });
  }
}