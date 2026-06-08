import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { Permission } from '../authorization/permissions.enum';

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    userId: string;
    userName: string;
    fullName: string;
    roles: string[];
    permissions: string[];
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);
    private router = inject(Router);

    private readonly baseUrl = `${environment.apiUrl}/api/Auth`;

    currentUser = signal<AuthResponse | null>(
        this.storage.getUser<AuthResponse>()
    );

    hasPermission(permission: Permission): boolean {
        const user = this.currentUser();
        if (!user) return false;
        return user.permissions.includes(permission.toString());
    }

    login(request: LoginRequest) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
            tap(response => {
                this.storage.setTokens(response.accessToken, response.refreshToken);
                this.storage.setUser(response);
                this.currentUser.set(response);
            })
        );
    }

    logout(): void {
        this.storage.clear();
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return this.storage.isAuthenticated();
    }

    forgotPassword(request: ForgotPasswordRequest) {
        return this.http.post(`${this.baseUrl}/forgot-password`, request);
    }

    resetPassword(request: ResetPasswordRequest) {
        return this.http.post(`${this.baseUrl}/reset-password`, request);
    }
}