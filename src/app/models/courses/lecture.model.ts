import {LectureProperty} from "./lecture-property.enum";

export interface Lecture {
  [LectureProperty.id]?: string;
  [LectureProperty.moduleId]: string;
  [LectureProperty.name]: string;
  [LectureProperty.orderNumber]: number;
  [LectureProperty.videoLink]: string;

}


