import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../../models/messages.model';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  getMessages(channelId: string, page: number): Observable<Message[]> {
    const url = `${this.baseUrl}/channels/${channelId}/messages?page=${page}`;
    return this.http.get<Message[]>(url);
  }

  postMessage(data: any): Observable<any> {
    const url = `${this.baseUrl}/message`;
    return this.http.post<any>(url, data);
  }

}
