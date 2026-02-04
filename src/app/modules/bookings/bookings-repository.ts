import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookingsRepository {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    addClient(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/addClient`, formData);
    }

    getClientList(fromDate: string, toDate: string): Observable<any[]> {
        const headers = new HttpHeaders({ 'fromDate': fromDate , 'toDate': toDate });
        return this.http.get<any[]>(`${this.baseUrl}/getClientList`, { headers });
    }

    getBookingList(fromDate: string, toDate: string): Observable<any[]> {
        const headers = new HttpHeaders({ 'fromDate': fromDate , 'toDate': toDate });
        return this.http.get<any[]>(`${this.baseUrl}/getBookings`, { headers });
    }

    getTodayBookingList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/getTodayBooking`);
    }
}
