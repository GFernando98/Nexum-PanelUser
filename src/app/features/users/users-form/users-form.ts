import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../../core/services/user.service';
import { RoleDto, RolesService } from '../../../core/services/role.service';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    CardModule,
    ToastModule,
    ToggleSwitchModule
  ],
  providers: [MessageService],
  templateUrl: './users-form.html',
  styleUrls: ['./users-form.scss']
})
export class UsersForm implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);

  isEdit = signal(false);
  userId = signal<string | null>(null);
  loading = signal(false);
  loadingData = signal(false);
  roles = signal<RoleDto[]>([]);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', Validators.required],
    password: ['', Validators.required],
    phoneNumber: [null],
    roleId: ['', Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit.set(true);
      this.userId.set(id);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();

      this.rolesService.getAll({ all: true }).subscribe({
        next: res => {
          this.roles.set(res.data);
          this.loadUser(id);
        },
        error: () => this.message.add({
          severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles.'
        })
      });
    } else {
      this.rolesService.getAll({ all: true }).subscribe({
        next: res => this.roles.set(res.data),
        error: () => this.message.add({
          severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles.'
        })
      });
    }
  }

  private loadUser(id: string): void {
    this.loadingData.set(true);
    this.usersService.getById(id).subscribe({
      next: user => {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userName: user.userName,
          phoneNumber: user.phoneNumber,
          roleId: user.roles?.[0]?.id ?? null,
          isActive: user.isActive
        });
        this.form.get('email')?.disable();
        this.form.get('userName')?.disable();
        this.loadingData.set(false);
      },
      error: () => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el usuario.' });
        this.loadingData.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);

    const id = this.userId();

    if (this.isEdit() && id) {
      const { firstName, lastName, phoneNumber, isActive } = this.form.getRawValue();
      this.usersService.edit(id, { id, firstName, lastName, phoneNumber, isActive }).subscribe({
        next: () => this.handleSuccess('Usuario actualizado correctamente.'),
        error: err => this.handleError(err)
      });
    } else {
      this.usersService.create(this.form.getRawValue()).subscribe({
        next: () => this.handleSuccess('Usuario creado correctamente.'),
        error: err => this.handleError(err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  private handleSuccess(detail: string): void {
    this.message.add({ severity: 'success', summary: 'Éxito', detail });
    setTimeout(() => this.router.navigate(['/users']), 1500);
  }

  private handleError(err: any): void {
    this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'Ocurrió un error.' });
    this.loading.set(false);
  }
}