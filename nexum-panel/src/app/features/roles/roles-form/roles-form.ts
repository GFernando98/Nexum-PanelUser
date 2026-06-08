import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Permissions, PermissionItem } from '../../../core/authorization/permissions.catalog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { RolesService } from '../../../core/services/role.service';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    DividerModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService],
  templateUrl: './roles-form.html',
  styleUrl: './roles-form.scss'
})
export class RolesForm implements OnInit {
  private fb = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);

  isEdit = signal(false);
  roleId = signal<string | null>(null);
  loading = signal(false);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

  allPermissions: PermissionItem[] = Permissions.Items;

  available = signal<PermissionItem[]>([]);
  assigned = signal<PermissionItem[]>([]);

  searchAvailable = '';
  searchAssigned = '';

  selectedAvailable = signal<Set<number>>(new Set());
  selectedAssigned = signal<Set<number>>(new Set());

  filteredAvailable = computed(() =>
    this.available().filter(p =>
      p.name.toLowerCase().includes(this.searchAvailable.toLowerCase())
    )
  );

  filteredAssigned = computed(() =>
    this.assigned().filter(p =>
      p.name.toLowerCase().includes(this.searchAssigned.toLowerCase())
    )
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.roleId.set(id);
      this.loadRole(id);
    } else {
      this.available.set([...this.allPermissions]);
    }
  }

  private loadRole(id: string): void {
    this.rolesService.getById(id).subscribe({
      next: (role: any) => {
        this.form.patchValue({ name: role.name });
        this.form.get('name')?.disable(); // nombre siempre disabled en edición

        // role.permissions es array de objetos { id, name, description }
        const assignedIds: number[] = (role.permissions ?? []).map((p: any) => p.id);

        this.assigned.set(
          this.allPermissions.filter(p => assignedIds.includes(p.id))
        );
        this.available.set(
          this.allPermissions.filter(p => !assignedIds.includes(p.id))
        );
      },
      error: () => this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el rol.' })
    });
  }

  toggleSelectAvailable(item: PermissionItem): void {
    const s = new Set(this.selectedAvailable());
    s.has(item.id) ? s.delete(item.id) : s.add(item.id);
    this.selectedAvailable.set(s);
  }

  toggleSelectAssigned(item: PermissionItem): void {
    const s = new Set(this.selectedAssigned());
    s.has(item.id) ? s.delete(item.id) : s.add(item.id);
    this.selectedAssigned.set(s);
  }

  isSelectedAvailable(item: PermissionItem): boolean {
    return this.selectedAvailable().has(item.id);
  }

  isSelectedAssigned(item: PermissionItem): boolean {
    return this.selectedAssigned().has(item.id);
  }

  agregar(): void {
    const ids = this.selectedAvailable();
    if (!ids.size) return;
    const toMove = this.available().filter(p => ids.has(p.id));
    this.assigned.set([...this.assigned(), ...toMove]);
    this.available.set(this.available().filter(p => !ids.has(p.id)));
    this.selectedAvailable.set(new Set());
  }

  quitar(): void {
    const ids = this.selectedAssigned();
    if (!ids.size) return;
    const toMove = this.assigned().filter(p => ids.has(p.id));
    this.available.set([...this.available(), ...toMove]);
    this.assigned.set(this.assigned().filter(p => !ids.has(p.id)));
    this.selectedAssigned.set(new Set());
  }

  onSubmit(): void {
    if (this.form.invalid && !this.isEdit()) return;
    this.loading.set(true);

    const id = this.roleId();
    const name: string = this.form.getRawValue().name;
    const permissionIds = this.assigned().map(p => p.id);

    if (this.isEdit() && id) {
      this.rolesService.updatePermissions(id, { roleId: id, permissionIds }).subscribe({
        next: () => this.handleSuccess('Rol actualizado correctamente.'),
        error: err => this.handleError(err)
      });
    } else {
      this.rolesService.create({ name }).subscribe({
        next: (res: any) => {
          const newId = res.id ?? res.data?.id;
          if (newId && permissionIds.length) {
            this.rolesService.updatePermissions(newId, { roleId: newId, permissionIds }).subscribe({
              next: () => this.handleSuccess('Rol creado correctamente.'),
              error: err => this.handleError(err)
            });
          } else {
            this.handleSuccess('Rol creado correctamente.');
          }
        },
        error: err => this.handleError(err)
      });
    }
  }

  goBack(): void { this.router.navigate(['/roles']); }

  private handleSuccess(detail: string): void {
    this.message.add({ severity: 'success', summary: 'Éxito', detail });
    setTimeout(() => this.router.navigate(['/roles']), 1500);
  }

  private handleError(err: any): void {
    this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'Ocurrió un error.' });
    this.loading.set(false);
  }
}