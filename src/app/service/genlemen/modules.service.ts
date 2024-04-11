import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Course} from "../../models/courses/course.model";
import {Module} from "../../models/courses/module.model";

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  private readonly baseUrl: string = `${environment.serverNodeUrl}`;

  constructor(private http: HttpClient) {}

  createModule(data: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/modules`, data);
  }

  updateModule(module: Module): Observable<Module> {
    return this.http.put<Module>(`${this.baseUrl}/modules`, module);
  }

  updateModulesOrder(courses: Course[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modules/updateOrder`, courses);
  }

  deleteModule(moduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/modules/${moduleId}`);
  }
}
