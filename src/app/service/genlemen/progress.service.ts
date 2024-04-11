import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Progress} from "../../models/courses/progress.model";

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  getProgress(userId: string): Observable<Progress> {
    return this.http.get<Progress>(`${this.baseUrl}/progress/${userId}`);
  }

  putUserProgressLecture(userId: string, lectureId: string) {
    const body = {
      completedLecture: lectureId,
    };

    return this.http.put(`${this.baseUrl}/progress/${userId}`, body);
  }

  putUserProgressModule(userId: string, moduleId: string) {
    const body = {
      completedModule: moduleId,
    };

    return this.http.put(`${this.baseUrl}/progress/${userId}`, body);
  }

  putUserProgressCourse(userId: string, courseId: string) {
    const body = {
      completedCourse: courseId,
    };

    return this.http.put(`${this.baseUrl}/progress/${userId}`, body);
  }

  /*createChannel(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/channels`, data);
  }

  putChannel(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/channels`, data);
  }

  deleteChannel(data: any): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/channels`, { body: data });
  }*/
}
