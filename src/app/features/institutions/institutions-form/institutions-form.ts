import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InstitutionService } from '../../../core/services/institution.service';

@Component({
  selector: 'app-institutions-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './institutions-form.html',
  styleUrl: './institutions-form.scss'
})
export class InstitutionsForm implements OnInit {
  private fb = inject(FormBuilder);
  private institutionService = inject(InstitutionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  institutionId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.institutionId = params.get('id');
      this.isEdit.set(!!this.institutionId);
      this.form.reset({ name: '' });

      if (this.institutionId) {
        this.loading.set(true);
        this.institutionService.getById(this.institutionId).subscribe({
          next: institution => {
            this.form.patchValue({ name: institution.name });
            this.loading.set(false);
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la institución.' });
            this.loading.set(false);
          }
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const request = { name: this.form.get('name')?.value?.trim() ?? '' };

    const request$ = this.isEdit()
      ? this.institutionService.edit(this.institutionId!, { id: this.institutionId!, ...request })
      : this.institutionService.create(request);

    request$.subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.isEdit() ? 'Institución actualizada.' : 'Institución creada.'
        });
        setTimeout(() => this.router.navigate(['/institutions']), 800);
      },
      error: err => {
        this.loading.set(false);
        this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'No se pudo guardar la institución.' });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/institutions']);
  }
}
