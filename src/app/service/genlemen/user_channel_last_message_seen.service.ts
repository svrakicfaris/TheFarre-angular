import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../../models/messages.model';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserChannelLastMessageSeen} from "../../models/user_channel_last_message_seen.model";

@Injectable({
  providedIn: 'root'
})
export class UserChannelLastMessageSeenService {
  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  getUserChannelLastMessageSeen(userId: string): Observable<UserChannelLastMessageSeen[]> {
    const url = `${this.baseUrl}/seen/${userId}`;
    return this.http.get<UserChannelLastMessageSeen[]>(url);
  }

  putUserChannelLastMessageSeen(data: UserChannelLastMessageSeen): Observable<UserChannelLastMessageSeen> {
    console.log("SHIIIIIT")
    return this.http.put<UserChannelLastMessageSeen>(`${this.baseUrl}/seen`, data);
  }

}
