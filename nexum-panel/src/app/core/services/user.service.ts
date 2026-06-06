import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface PageRequest {
    pageNumber?: number;
    pageSize?: number;
    parameter?: string;
    order?: string;
    column?: string;
    all?: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userName: string;
    phoneNumber?: string;
    isActive: boolean;
    createdAt: string;
    roles: string[];
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber?: string;
    roleId: string;
}

export interface EditUserRequest {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly baseUrl = `${environment.apiUrl}/api/Users`;

    constructor(private http: HttpClient) { }

    getAll(request: PageRequest = {}) {
        let params = new HttpParams()
            .set('pageNumber', request.pageNumber ?? 1)
            .set('pageSize', request.pageSize ?? 10);

        if (request.parameter) params = params.set('parameter', request.parameter);
        if (request.order) params = params.set('order', request.order);
        if (request.column) params = params.set('column', request.column);
        if (request.all) params = params.set('all', request.all);

        return this.http.get<PaginatedResult<UserDto>>(`${this.baseUrl}/GetAll`, { params });
    }

    getById(id: string) {
        return this.http.get<UserDto>(`${this.baseUrl}/GetById/${id}`);
    }

    create(request: CreateUserRequest) {
        return this.http.post<string>(`${this.baseUrl}/Create`, request);
    }

    edit(id: string, request: EditUserRequest) {
        return this.http.put(`${this.baseUrl}/Edit/${id}`, request);
    }

    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/Delete/${id}`);
    }

    changePassword(id: string, currentPassword: string, newPassword: string) {
        return this.http.patch(`${this.baseUrl}/${id}/change-password`, {
            id, currentPassword, newPassword
        });
    }

    assignRole(id: string, roleName: string) {
        return this.http.patch(`${this.baseUrl}/assign-role${id}`, {
            userId: id, roleName
        });
    }
}