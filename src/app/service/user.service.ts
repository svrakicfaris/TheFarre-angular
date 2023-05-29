import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  private readonly baseUrl: string = `${environment.backendUrl}`;

  constructor(private http: HttpClient) {}

  public generateProfile(text: string): Observable<User> {
    const data = {
      text: text
    };

    return this.http.post<User>(`${this.baseUrl}`, data);
    //return this.http.get<User>(`${this.baseUrl}`);
  }

  public sendData(formData: FormData): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}`, formData);
  }


}
