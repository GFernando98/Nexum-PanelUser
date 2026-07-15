import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HistoryDto {
    entity: string;
    property: string;
    entityId: string;
    date: string;
    userId: string;
    userName: string;
    oldValue: string;
    newValue: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/History`;

    getHistory(entity: string, entityId: string): Observable<HistoryDto[]> {
        const params = new HttpParams()
            .set('Entity', entity)
            .set('EntityId', entityId);

        return this.http.get<HistoryDto[] | { data: HistoryDto[] } | { result: { data: HistoryDto[] } }>(`${this.baseUrl}/GetHistory`, { params }).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return response;
                }

                if (response && typeof response === 'object') {
                    const anyResponse = response as Record<string, unknown>;
                    if (Array.isArray(anyResponse['data'])) {
                        return anyResponse['data'] as HistoryDto[];
                    }
                    if (anyResponse['result'] && typeof anyResponse['result'] === 'object') {
                        const result = anyResponse['result'] as { data?: HistoryDto[] };
                        return result.data ?? [];
                    }
                }

                return [];
            })
        );
    }
}
