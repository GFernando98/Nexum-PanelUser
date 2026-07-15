import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { ContactRelationshipDto, ContactRelationshipService } from '../../../core/services/contact-relationship.service';
import { HistoryDto, HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-contact-relationships-list',
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
    DialogModule,
    HasPermissionDirective
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './contact-relationships-list.html',
  styleUrl: './contact-relationships-list.scss'
})
export class ContactRelationshipsList implements OnInit {
  private contactRelationshipService = inject(ContactRelationshipService);
  private historyService = inject(HistoryService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);
  private message = inject(MessageService);

  Permission = Permission;

  contactRelationships = signal<ContactRelationshipDto[]>([]);
  loading = signal(true);
  totalRecords = signal(0);
  pageSize = 10;
  search = '';
  historyVisible = false;
  historyLoading = false;
  historyEntries: HistoryDto[] = [];
  historyTitle = 'Historial';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(pageNumber = 1): void {
    this.loading.set(true);
    this.contactRelationshipService.getAll({ pageNumber, pageSize: this.pageSize, parameter: this.search || undefined }).subscribe({
      next: res => {
        this.contactRelationships.set(res.data);
        this.totalRecords.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las relaciones de contacto.' });
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.load(1);
      this.searchTimeout = null;
    }, 300);
  }

  onPageChange(event: any): void {
    this.pageSize = event.rows;
    this.load(event.first / event.rows + 1);
  }

  goToCreate(): void {
    this.router.navigate(['/contact-relationships/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/contact-relationships/edit', id]);
  }

  openHistory(contactRelationship: ContactRelationshipDto): void {
    this.historyTitle = `Historial de ${contactRelationship.name}`;
    this.historyLoading = true;
    this.historyVisible = true;
    this.historyEntries = [];

    this.historyService.getHistory('ContactRelationship', contactRelationship.id).subscribe({
      next: entries => {
        this.historyEntries = entries;
        this.historyLoading = false;
      },
      error: () => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el historial.' });
        this.historyLoading = false;
      }
    });
  }

  closeHistory(): void {
    this.historyVisible = false;
    this.historyEntries = [];
  }

  confirmDelete(contactRelationship: ContactRelationshipDto): void {
    this.confirmation.confirm({
      message: `¿Estás seguro de eliminar la relación de contacto <b>${contactRelationship.name}</b>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.contactRelationshipService.delete(contactRelationship.id).subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Relación de contacto eliminada.' });
          this.load();
        },
        error: err => this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'Error al eliminar.' })
      })
    });
  }
}
