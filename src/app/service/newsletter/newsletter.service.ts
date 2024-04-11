import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private baseUrl =  `${environment.serverNodeUrl}`; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getNewsletterEmailsByDateRange(startDate: string, endDate: string): Observable<any[]> {
    const url = `${this.baseUrl}/newsletters?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any[]>(url);
  }

  getNewsletterEmail(id: string) {
    return this.http.get<any>(`${this.baseUrl}/newsletters/${id}`);
  }

  createNewsletterEmail(newNewsletter: { scheduleTime: Date | string | null; subject: string; scheduleDate: Date | string | null; text: string }) {
    return this.http.post(`${this.baseUrl}/newsletters`, newNewsletter);
  }

  updateNewsletterEmail(id: string, updatedNewsletter: { scheduleTime: Date | string | null; subject: string; scheduleDate: Date | string | null; text: string; sent: boolean  }): Observable<any> {
    const url = `${this.baseUrl}/newsletters/${id}`;
    return this.http.put<any>(url, updatedNewsletter);
  }

  deleteNewsletterEmail(id: string): Observable<any> {
    const url = `${this.baseUrl}/newsletters/${id}`;
    return this.http.delete<any>(url);
  }

  sendNewsletterEmail(newNewsletter: { scheduleTime: string; subject: string; scheduleDate: string; text: string; sent: boolean }) {
    return this.http.post(`${this.baseUrl}/newsletters/send`, newNewsletter);
  }

}
