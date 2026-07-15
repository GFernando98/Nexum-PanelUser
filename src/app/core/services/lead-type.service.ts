import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './role.service';

export interface LeadTypeDto {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface CreateLeadTypeRequest {
  name: string;
  description: string | null;
  icon: string | null;
}

export interface EditLeadTypeRequest {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

@Injectable({ providedIn: 'root' })
export class LeadTypeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/LeadType`;

  private normalizeLeadTypeResponse(response: unknown): LeadTypeDto {
    if (!response || typeof response !== 'object') {
      return { id: '', name: '', description: null, icon: null };
    }

    const value = response as Record<string, unknown>;
    const data = value['data'];
    const result = value['result'];

    const nestedData =
      data && typeof data === 'object' ? (data as Record<string, unknown>) :
      result && typeof result === 'object' && typeof (result as Record<string, unknown>)['data'] === 'object'
        ? ((result as Record<string, unknown>)['data'] as Record<string, unknown>)
        : undefined;

    const source = nestedData ?? value;
    const descriptionValue = source['description'] ?? source['Description'];
    const iconValue = source['icon'] ?? source['Icon'];

    return {
      id: String(source['id'] ?? source['Id'] ?? ''),
      name: String(source['name'] ?? source['Name'] ?? ''),
      description: descriptionValue == null ? null : String(descriptionValue),
      icon: iconValue == null ? null : String(iconValue)
    };
  }

  getAll(query: PaginatedQuery = {}) {
    let params = new HttpParams();
    if (query.pageNumber != null) params = params.set('PageNumber', query.pageNumber);
    if (query.pageSize != null) params = params.set('PageSize', query.pageSize);
    if (query.parameter) params = params.set('Parameter', query.parameter);
    if (query.order) params = params.set('Order', query.order);
    if (query.column) params = params.set('Column', query.column);
    if (query.all != null) params = params.set('All', query.all);

    return this.http.get<PaginatedResult<LeadTypeDto>>(`${this.baseUrl}/GetAll`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/GetById/${id}`).pipe(
      map(response => this.normalizeLeadTypeResponse(response))
    );
  }

  create(request: CreateLeadTypeRequest) {
    return this.http.post(`${this.baseUrl}/Create`, request, { responseType: 'text' });
  }

  edit(id: string, request: EditLeadTypeRequest) {
    return this.http.post(`${this.baseUrl}/Update/${id}`, request, { responseType: 'text' });
  }

  delete(id: string) {
    return this.http.post(`${this.baseUrl}/Delete/${id}`, {}, { responseType: 'text' });
  }
}
