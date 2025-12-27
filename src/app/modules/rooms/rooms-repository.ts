import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomsRepository {

    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getRooms(): Observable<any[]> {
        // OPTIONAL: If API needs auth token
        const token = localStorage.getItem('token');
        const headers = token
            ? new HttpHeaders({ Authorization: `Bearer ${token}` })
            : undefined;
        return this.http.get<any[]>(`${this.baseUrl}/getRoomDetails`, { headers });
    }

    addBooking(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/createClientAndBooking`, formData);
    }

    getBookingDetails(id: string): Observable<any> {
        const headers = new HttpHeaders({ id: id });
        return this.http.get(`${this.baseUrl}/getBookingDetailsById`, { headers });
    }

    getRoomDetails(date: string): Observable<any> {
        const headers = new HttpHeaders({ 'date-filter': date });
        return this.http.get(`${this.baseUrl}/getRoomDetails`, { headers });
    }

    getRoomUserDetails(): Observable<any> {
        return this.http.get(`${this.baseUrl}/getRoomUserDetails`);
    }

}
