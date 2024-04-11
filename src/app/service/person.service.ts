import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

@Injectable()
export class PersonService {
  private readonly baseUrl: string = `${environment.pythonUrl}`;

  constructor(private http: HttpClient) {}

  public generateProfile(text: string): Observable<Person> {
    const data = {
      text: text
    };

    return this.http.post<Person>(`${this.baseUrl}`, data);
    //return this.http.get<User>(`${this.baseUrl}`);
  }

  public sendData(formData: FormData): Observable<Person>{
    return this.http.post<Person>(`${this.baseUrl}`, formData);
  }


}
