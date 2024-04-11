import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {mergeMap, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../models/user.model';
import {SignInForm} from "../models/sign-in-form.interface";
import {AuthResponse} from "../models/auth-response.interface";
import {AuthService} from "./auth.service";
import {UserProperty} from "../models/user-property.enum";

@Injectable()
export class UserService {

  //private readonly mongodbUrl: string = `${environment.localNodeUrl}`;

  //private readonly baseUrl: string = `${environment.localNodeUrl}`;
  private readonly mongodbUrl: string = `${environment.serverNodeUrl}`;

  private profile!: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {

  }

  public getUserById(id: number): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + `${this.authService.getToken()}`
    });

    /*return this.http.get<User>(`${this.baseUrl}/user/${id}`, { headers });*/
    return this.http.get<User>(`${this.mongodbUrl}/user/${id}`, { headers });
  }

  public updateUser(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + `${this.authService.getToken()}`
    });
    return this.http.put(`${this.mongodbUrl}/user/${user.id}`, user, { headers });
    /*return this.http.put(`${this.baseUrl}/user/${user.id}`, user, { headers });*/
  }

  public login(signInForm: SignInForm): Observable<void> {
    const body = {
      username: signInForm.username,
      password: signInForm.password,
    };

    /*return this.http.post<AuthResponse>(`${this.baseUrl}/authenticate`, body).pipe(
      mergeMap(response => {
        this.authService.setToken(response.token);
        console.log(response.token)
        return of(undefined);
      })
    );*/

    return this.http.post<AuthResponse>(`${this.mongodbUrl}/authenticate`, body).pipe(
      mergeMap(response => {
        this.authService.setToken(response.token);
        console.log(response.token)
        return of(undefined);
      })
    );
  }

  public create(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //this.http.post<User>(`${this.baseUrl}/signup`, user, { headers });
    return this.http.post<User>(`${this.mongodbUrl}/signup`, user, { headers });
  }

  public subscribeToNewsletter(user: User): Observable<any> {
    //this.http.post<any>(`${this.baseUrl}/newsletter`, user);
    return this.http.post<any>(`${this.mongodbUrl}/newsletter-subscription`, user);
  }

  public fetchUser(): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + `${this.authService.getToken()}`
    });


    /*return this.http.get<User>(`${this.baseUrl}/whoami`, { headers }).pipe(
      mergeMap(response => {
        this.profile = response;
        return of(undefined);
      })
    );*/

    return this.http.get<User>(`${this.mongodbUrl}/whoami`, { headers }).pipe(
      mergeMap(response => {
        this.profile = response;
        return of(undefined);
      })
    );
  }

  public checkToken(): Observable<any>{
    return of(undefined)
  }

  public getUser(): User {
    if(this.profile == null)
    {
      this.fetchUser();
    }
    return this.profile;
  }

  /*public uploadProfilePicture(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('directory', 'user-profile');

    const req = new HttpRequest('POST', `${this.mongodbUrl}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }*/
}
