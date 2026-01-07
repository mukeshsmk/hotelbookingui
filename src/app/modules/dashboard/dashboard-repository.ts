import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardRepository {

    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getCardDetails(): Observable<any> {
          return this.http.get<any[]>(`${this.baseUrl}/getDashboardservice`);
    }

}
