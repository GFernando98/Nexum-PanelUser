import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageRequest, PaginatedResult } from './user.service';

export interface RoleDto {
    id: string;
    name: string;
    permissionCount: number;
}

export interface RoleDetailDto extends RoleDto {
    permissions: PermissionDto[];
}

export interface PermissionDto {
    id: number;
    name: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
    private readonly baseUrl = `${environment.apiUrl}/api/Roles`;

    constructor(private http: HttpClient) { }

    getAll(request: PageRequest = {}) {
        let params = new HttpParams()
            .set('pageNumber', request.pageNumber ?? 1)
            .set('pageSize', request.pageSize ?? 10);

        if (request.parameter) params = params.set('parameter', request.parameter);
        if (request.order) params = params.set('order', request.order);
        if (request.column) params = params.set('column', request.column);

        return this.http.get<PaginatedResult<RoleDto>>(`${this.baseUrl}/GetAll`, { params });
    }

    getById(id: string) {
        return this.http.get<RoleDetailDto>(`${this.baseUrl}/GetById/${id}`);
    }

    create(name: string) {
        return this.http.post<string>(`${this.baseUrl}/Create`, { name });
    }

    edit(id: string, name: string) {
        return this.http.put(`${this.baseUrl}/Edit/${id}`, { id, name });
    }

    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/Delete/${id}`);
    }

    updatePermissions(roleId: string, permissionIds: number[]) {
        return this.http.put(`${this.baseUrl}/${roleId}/permissions`, {
            roleId, permissionIds
        });
    }
}