import {ModuleProperty} from "./module-property.enum";
import {Lecture} from "./lecture.model";

export interface Module {
  [ModuleProperty.id]?: string;
  [ModuleProperty.courseId]: string;
  [ModuleProperty.name]: string;
  [ModuleProperty.orderNumber]: number;
  [ModuleProperty.lectures]: Lecture[];
}


