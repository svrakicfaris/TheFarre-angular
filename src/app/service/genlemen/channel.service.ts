import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  getChannels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/channels`);
  }

  createChannel(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/channels`, data);
  }

  putChannel(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/channels`, data);
  }

  deleteChannel(data: any): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/channels`, { body: data });
  }
}
