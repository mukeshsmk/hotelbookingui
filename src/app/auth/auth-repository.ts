import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthRepository {

  private apiUrl = 'http://localhost:8080/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'username': username,
      'password': password
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
