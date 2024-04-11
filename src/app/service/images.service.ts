import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}/image-upload`;

  postResponse: any;
  successResponse!: string;

  constructor(
    private http: HttpClient,
  ) {
  }

  upload(file: File, directory: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('directory', directory);

    const req = new HttpRequest('POST', `${this.baseUrl}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}
