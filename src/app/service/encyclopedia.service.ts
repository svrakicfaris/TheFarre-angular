import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class EncyclopediaService {
  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  getEncyclopedia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/encyclopedia`);
  }

  putEncyclopedia(encyclopedia: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/encyclopedia`, encyclopedia);
  }

}
