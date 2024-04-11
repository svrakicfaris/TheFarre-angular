import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Course} from "../../models/courses/course.model";
import {Module} from "../../models/courses/module.model";
import {Lecture} from "../../models/courses/lecture.model";

@Injectable({
  providedIn: 'root'
})
export class LecturesService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  createLecture(data: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/lectures`, data);
  }

  updateLecture(data: Lecture): Observable<Lecture>{
    return this.http.put<Lecture>(`${this.baseUrl}/lectures`, data);
  }

  updateLecturesOrder(courses: Course[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/lectures/updateOrder`, courses);
  }

  deleteLecture(lectureId: string): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/lectures/${lectureId}`);
  }
}
