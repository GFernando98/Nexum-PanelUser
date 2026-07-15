import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContactRelationshipService } from '../../../core/services/contact-relationship.service';

@Component({
  selector: 'app-contact-relationships-form',
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
  templateUrl: './contact-relationships-form.html',
  styleUrl: './contact-relationships-form.scss'
})
export class ContactRelationshipsForm implements OnInit {
  private fb = inject(FormBuilder);
  private contactRelationshipService = inject(ContactRelationshipService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  contactRelationshipId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contactRelationshipId = params.get('id');
      this.isEdit.set(!!this.contactRelationshipId);
      this.form.reset({ name: '' });

      if (this.contactRelationshipId) {
        this.loading.set(true);
        this.contactRelationshipService.getById(this.contactRelationshipId).subscribe({
          next: contactRelationship => {
            this.form.patchValue({ name: contactRelationship.name });
            this.loading.set(false);
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la relación de contacto.' });
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
      ? this.contactRelationshipService.edit(this.contactRelationshipId!, { id: this.contactRelationshipId!, ...request })
      : this.contactRelationshipService.create(request);

    request$.subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.isEdit() ? 'Relación de contacto actualizada.' : 'Relación de contacto creada.'
        });
        setTimeout(() => this.router.navigate(['/contact-relationships']), 800);
      },
      error: err => {
        this.loading.set(false);
        this.message.add({ severity: 'error', summary: 'Error', detail: err.error?.error ?? 'No se pudo guardar la relación de contacto.' });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/contact-relationships']);
  }
}
