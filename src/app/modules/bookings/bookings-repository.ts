import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BookingsRepository {

    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    addClient(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/addClient`, formData);
    }

    getClientList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/getClientList`);
    }

    getBookingList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/getBookings`);
    }

    getTodayBookingList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/getTodayBooking`);
    }
}
