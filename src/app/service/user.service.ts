import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from "rxjs";
import {User} from "../models/user.model";


@Injectable()
export class UserService {

  private readonly baseUrl: string = `${environment.backendUrl}`;

  constructor(
    private http: HttpClient,
  ) {
  }

  public createUserProfile(text: string): Observable<User> {

    const data = {
      text: text
    };

    return this.http.post<User>(`${this.baseUrl}/process-text`, data);
  }
}
