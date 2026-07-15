import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProfessionDto, ProfessionService } from '../../../core/services/profession.service';

@Component({
  selector: 'app-professions-form',
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
  templateUrl: './professions-form.html',
  styleUrl: './professions-form.scss'
})
export class ProfessionsForm implements OnInit {
  private fb = inject(FormBuilder);
  private professionService = inject(ProfessionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  professionId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.professionId = params.get('id');
      this.isEdit.set(!!this.professionId);
      this.form.reset({ name: '' });

      if (this.professionId) {
        this.loading.set(true);
        this.professionService.getById(this.professionId).subscribe({
          next: profession => {
            this.form.patchValue({ name: profession.name });
            this.loading.set(false);
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la profesión.' });
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
      ? this.professionService.edit(this.professionId!, { id: this.professionId!, ...request })
      : this.professionService.create(request);

    request$.subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Éxito', detail: this.isEdit() ? 'Profesión actualizada.' : 'Profesión creada.' });
        setTimeout(() => this.router.navigate(['/professions']), 800);
      },
      error: err => {
        this.loading.set(false);
        this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'No se pudo guardar la profesión.' });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/professions']);
  }
}
