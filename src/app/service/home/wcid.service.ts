// CategoryService.ts

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WcidService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/categories`);
  }

  postCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/categories`, data);
  }

  putCategory(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/categories`, data);
  }

  deleteCategory(data: any): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/categories`, { body: data });
  }


}
