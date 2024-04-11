import {CourseProperty} from "./course-property.enum";
import {Module} from "./module.model";

export interface Course {
  [CourseProperty.id]?: string;
  [CourseProperty.name]: string;
  [CourseProperty.orderNumber]: number;
  [CourseProperty.modules]: Module[];
}


