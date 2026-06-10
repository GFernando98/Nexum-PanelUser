import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface RoleDto {
    id: string;
    name: string;
}

export interface CreateRoleRequest {
    name: string;
}

export interface EditRoleRequest {
    id: string;
    name: string;
}

export interface UpdateRolePermissionsRequest {
    roleId: string;
    permissionIds: number[];
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

export interface PaginatedQuery {
    pageNumber?: number;
    pageSize?: number;
    parameter?: string;
    order?: string;
    column?: string;
    all?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/Roles`;

    getAll(query: PaginatedQuery = {}) {
        let params = new HttpParams();
        if (query.pageNumber != null) params = params.set('PageNumber', query.pageNumber);
        if (query.pageSize != null) params = params.set('PageSize', query.pageSize);
        if (query.parameter) params = params.set('Parameter', query.parameter);
        if (query.order) params = params.set('Order', query.order);
        if (query.column) params = params.set('Column', query.column);
        if (query.all != null) params = params.set('All', query.all);

        return this.http.get<PaginatedResult<RoleDto>>(`${this.baseUrl}/GetAll`, { params });
    }

    getById(id: string) {
        return this.http.get<RoleDto>(`${this.baseUrl}/GetById/${id}`);
    }

    create(request: CreateRoleRequest) {
        return this.http.post(`${this.baseUrl}/Create`, request, { responseType: 'text' });
    }

    edit(id: string, request: EditRoleRequest) {
        return this.http.put(`${this.baseUrl}/Edit/${id}`, request);
    }

    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/Delete/${id}`);
    }

    updatePermissions(id: string, request: UpdateRolePermissionsRequest) {
        return this.http.put(`${this.baseUrl}/permissions/${id}`, request);
    }
}