import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardRepository {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCardDetails(): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrl}/getDashboardservice`);
    }

    getBarChartData(): Observable<any> {
        const headers = new HttpHeaders({ days: 7 });
        return this.http.get<any[]>(`${this.baseUrl}/getBarChart`, { headers });
    }
}
