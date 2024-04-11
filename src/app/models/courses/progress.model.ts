import {ProgressProperty} from "./progress-property.enum";

export interface Progress {
  [ProgressProperty.id]?: string;
  [ProgressProperty.userId]: string;
  [ProgressProperty.completedCourses]: string[];
  [ProgressProperty.completedModules]: string[];
  [ProgressProperty.completedLectures]: string[];
}


