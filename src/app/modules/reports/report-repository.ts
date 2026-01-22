import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportRepository {

    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

}
