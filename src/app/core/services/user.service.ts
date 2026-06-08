import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './role.service';

export interface RoleRef {
    id: string;
    name: string;
}

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userName: string;
    phoneNumber: string | null;
    isActive: boolean;
    createdAt: string;
    roles: RoleRef[];
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber?: string | null;
    roleId: string;
}

export interface EditUserRequest {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    isActive: boolean;
}

export interface ChangePasswordRequest {
    id: string;
    currentPassword: string;
    newPassword: string;
}

export interface AssignRoleRequest {
    userId: string;
    roleName: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/Users`;

    getAll(query: PaginatedQuery = {}) {
        let params = new HttpParams();
        if (query.pageNumber != null) params = params.set('PageNumber', query.pageNumber);
        if (query.pageSize != null) params = params.set('PageSize', query.pageSize);
        if (query.parameter) params = params.set('Parameter', query.parameter);
        if (query.order) params = params.set('Order', query.order);
        if (query.column) params = params.set('Column', query.column);
        if (query.all != null) params = params.set('All', query.all);

        return this.http.get<PaginatedResult<UserDto>>(`${this.baseUrl}/GetAll`, { params });
    }

    getById(id: string) {
        return this.http.get<UserDto>(`${this.baseUrl}/GetById/${id}`);
    }

    create(request: CreateUserRequest) {
        return this.http.post(`${this.baseUrl}/Create`, request);
    }

    edit(id: string, request: EditUserRequest) {
        return this.http.put(`${this.baseUrl}/Edit/${id}`, request);
    }

    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/Delete/${id}`);
    }

    changePassword(id: string, request: ChangePasswordRequest) {
        return this.http.patch(`${this.baseUrl}/change-password/${id}`, request);
    }

    assignRole(id: string, request: AssignRoleRequest) {
        return this.http.patch(`${this.baseUrl}/assign-role/${id}`, request);
    }
}