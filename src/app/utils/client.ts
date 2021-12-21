import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env, environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Client {
    
    constructor(private http: HttpClient) {}
    headers = new HttpHeaders({
        Authorization: `Bearer ${sessionStorage.getItem('access-token')}`,
        'Content-Type': 'application/json',
    });

    GET(endpoint: string, headers?: any) {
        return this.http.get<Record<string, unknown>>(`${environment.apiroot}${endpoint}`, {
            headers: headers || this.headers,
        });
    }

    POST(endpoint: string, data?: any, headers?: any) {
        return this.http.post<Record<string, unknown>>(`${environment.apiroot}${endpoint}`, data, {
            headers: headers || this.headers,
        });
    }

    PATCH(endpoint: string, id: string, data: any, headers?: any) {
        return this.http.patch<Record<string, unknown>>(`${environment.apiroot}${endpoint}/${id}`, data, {
            headers: headers || this.headers,
        });
    }
}
