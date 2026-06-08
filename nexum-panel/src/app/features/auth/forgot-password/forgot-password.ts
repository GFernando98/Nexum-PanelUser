import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule,
        ButtonModule, InputTextModule, CardModule, MessageModule],
    templateUrl: './forgot-password.html',
    styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);

    loading = false;
    error = '';
    submitted = false;

    form: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    onSubmit(): void {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = '';

        this.auth.forgotPassword(this.form.value).subscribe({
            next: () => { this.submitted = true; this.loading = false; },
            error: err => {
                // Por seguridad mostramos éxito igual (evita enumerar emails)
                this.submitted = true;
                this.loading = false;
            }
        });
    }
}