import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LeadTypeService } from '../../../core/services/lead-type.service';

@Component({
  selector: 'app-lead-types-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ColorPickerModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './lead-types-form.html',
  styleUrl: './lead-types-form.scss'
})
export class LeadTypesForm implements OnInit {
  private fb = inject(FormBuilder);
  private leadTypeService = inject(LeadTypeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  leadTypeId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.maxLength(500)]],
      icon: ['', [Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.leadTypeId = params.get('id');
      this.isEdit.set(!!this.leadTypeId);
      this.form.reset({ name: '' });

      if (this.leadTypeId) {
        this.loading.set(true);
        this.leadTypeService.getById(this.leadTypeId).subscribe({
          next: leadType => {
            this.form.patchValue({
              name: leadType.name,
              description: leadType.description ?? '',
              icon: leadType.icon ?? ''
            });
            this.loading.set(false);
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el tipo de lead.' });
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
    const request = {
      name: this.form.get('name')?.value?.trim() ?? '',
      description: this.form.get('description')?.value?.trim() ?? '',
      icon: this.form.get('icon')?.value?.trim() ?? ''
    };

    const request$ = this.isEdit()
      ? this.leadTypeService.edit(this.leadTypeId!, { id: this.leadTypeId!, ...request })
      : this.leadTypeService.create(request);

    request$.subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.isEdit() ? 'Tipo de lead actualizado.' : 'Tipo de lead creado.'
        });
        setTimeout(() => this.router.navigate(['/lead-types']), 800);
      },
      error: err => {
        this.loading.set(false);
        this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'No se pudo guardar el tipo de lead.' });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lead-types']);
  }
}
