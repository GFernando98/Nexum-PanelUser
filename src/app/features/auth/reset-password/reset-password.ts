import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule,
        ButtonModule, PasswordModule, CardModule, MessageModule],
    templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.scss']
})
export class ResetPassword implements OnInit {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private route = inject(ActivatedRoute);

    loading = false;
    error = '';
    resetDone = false;

    private email = '';
    private token = '';

    form: FormGroup = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    ngOnInit(): void {
        // El link del email debe incluir ?email=...&token=...
        this.email = this.route.snapshot.queryParams['email'] ?? '';
        this.token = this.route.snapshot.queryParams['token'] ?? '';
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = '';

        this.auth.resetPassword({
            email: this.email,
            token: this.token,
            newPassword: this.form.value.newPassword
        }).subscribe({
            next: () => { this.resetDone = true; this.loading = false; },
            error: err => {
                this.error = err.error?.error ?? 'Error al restablecer la contraseña.';
                this.loading = false;
            }
        });
    }
}