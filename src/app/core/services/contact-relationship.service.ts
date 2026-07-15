import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './role.service';

export interface ContactRelationshipDto {
  id: string;
  name: string;
}

export interface CreateContactRelationshipRequest {
  name: string;
}

export interface EditContactRelationshipRequest {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ContactRelationshipService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/ContactRelationship`;

  private normalizeContactRelationshipResponse(response: unknown): ContactRelationshipDto {
    if (!response || typeof response !== 'object') {
      return { id: '', name: '' };
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

    return {
      id: String(source['id'] ?? source['Id'] ?? ''),
      name: String(source['name'] ?? source['Name'] ?? '')
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

    return this.http.get<PaginatedResult<ContactRelationshipDto>>(`${this.baseUrl}/GetAll`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/GetById/${id}`).pipe(
      map(response => this.normalizeContactRelationshipResponse(response))
    );
  }

  create(request: CreateContactRelationshipRequest) {
    return this.http.post(`${this.baseUrl}/Create`, request, { responseType: 'text' });
  }

  edit(id: string, request: EditContactRelationshipRequest) {
    return this.http.post(`${this.baseUrl}/Update/${id}`, request, { responseType: 'text' });
  }

  delete(id: string) {
    return this.http.post(`${this.baseUrl}/Delete/${id}`, {}, { responseType: 'text' });
  }
}
