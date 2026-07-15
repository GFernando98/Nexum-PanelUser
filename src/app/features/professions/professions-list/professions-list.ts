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
import { ProfessionDto, ProfessionService } from '../../../core/services/profession.service';
import { HistoryDto, HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-professions-list',
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
  templateUrl: './professions-list.html',
  styleUrl: './professions-list.scss'
})
export class ProfessionsList implements OnInit {
  private professionService = inject(ProfessionService);
  private historyService = inject(HistoryService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);
  private message = inject(MessageService);

  Permission = Permission;

  professions = signal<ProfessionDto[]>([]);
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
    this.professionService.getAll({ pageNumber, pageSize: this.pageSize, parameter: this.search || undefined }).subscribe({
      next: res => {
        this.professions.set(res.data);
        this.totalRecords.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las profesiones.' });
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
    this.router.navigate(['/professions/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/professions/edit', id]);
  }

  openHistory(profession: ProfessionDto): void {
    this.historyTitle = `Historial de ${profession.name}`;
    this.historyLoading = true;
    this.historyVisible = true;
    this.historyEntries = [];

    this.historyService.getHistory('Profession', profession.id).subscribe({
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

  confirmDelete(profession: ProfessionDto): void {
    this.confirmation.confirm({
      message: `¿Estás seguro de eliminar la profesión <b>${profession.name}</b>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.professionService.delete(profession.id).subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Profesión eliminada.' });
          this.load();
        },
        error: err => this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'Error al eliminar.' })
      })
    });
  }
}
