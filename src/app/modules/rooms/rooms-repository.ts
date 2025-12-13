import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomsRepository {

    private apiUrl = 'http://localhost:8080/getRoomDetails';

    constructor(private http: HttpClient) { }

    getRooms(): Observable<any[]> {

        // OPTIONAL: If API needs auth token
        const token = localStorage.getItem('token');

        const headers = token
            ? new HttpHeaders({ Authorization: `Bearer ${token}` })
            : undefined;

        return this.http.get<any[]>(this.apiUrl, { headers });
    }
}
