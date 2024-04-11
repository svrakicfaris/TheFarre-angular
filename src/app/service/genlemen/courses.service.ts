import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Course} from "../../models/courses/course.model";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  createCourse(data: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/courses`, data);
  }

  updateCourse(data: Course): Observable<Course>{
    return this.http.put<Course>(`${this.baseUrl}/courses`, data);
  }

  updateCoursesOrder(courses: Course[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/courses/updateOrder`, courses);
  }

  deleteCourse(courseId: string): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/courses/${courseId}`);
  }

 /* createChannel(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/channels`, data);
  }

  putChannel(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/channels`, data);
  }

  deleteChannel(data: any): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/channels`, { body: data });
  }*/
}
