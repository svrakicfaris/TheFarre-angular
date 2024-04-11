import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../service/user.service";
import {ProgressService} from "../../service/genlemen/progress.service";
import {UserProperty} from "../../models/user-property.enum";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoursesService} from "../../service/genlemen/courses.service";
import {Course} from "../../models/courses/course.model";
import {Progress} from "../../models/courses/progress.model";
import {Module} from "../../models/courses/module.model";
import {LectureProperty} from "../../models/courses/lecture-property.enum";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit{

  user!: User;
  courses!: Course[];
  progress: any;

  panelOpenState = false;

  selectedCourse: Course | null = null; // Initialize the selectedCourse as null



  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userService: UserService,
    private coursesService: CoursesService,
    private progressService: ProgressService,
  ) {
  }

  async ngOnInit() {
    await this.fetchUser();
    this.getCourses()
    this.getProgress()
  }

  fetchUser() {
    this.user = this.userService.getUser();
  }

  getCourses() {
    this.coursesService.getCourses().subscribe(
      (courses: Course[]) => {
        this.courses = courses; // Assign the retrieved courses to the courses property
      },
      (error) => {
        this.snackBar.open(error, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        console.error('Error getting courses:', error);
      }
    );
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
  }

  isCourseSelected(course: Course) {
    return this.selectedCourse === course;
  }


  getProgress(){
    this.progressService.getProgress(this.user[UserProperty.id]!).subscribe(
      (progress: Progress) => {
        this.progress = progress; // Assign the retrieved courses to the courses property
      },
      (error) => {
        this.snackBar.open(error, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        console.error('Error getting progress:', error);
      }
    );
  }

  isModuleCompleted(moduleId: string | undefined): boolean {
    if (!this.user || !this.progress || !this.progress.completedModules) {
      return false;
    }
    return this.progress.completedModules.includes(moduleId);
  }

  isLectureCompleted(module: Module, lectureId: string | undefined): boolean {
    if (!this.user || !this.progress.completedLectures) {
      return false;
    }
    return this.progress.completedLectures.some(
      (completedLectureId: string | undefined) =>
        module.lectures.some((lecture) => lecture._id === completedLectureId) &&
        completedLectureId === lectureId
    );
  }

  isPreviousLectureCompleted(module: Module, lectureIndex: number): string {
    const currentLecture = module.lectures[lectureIndex];
    if (lectureIndex === 0) {
      if(this.isLectureCompleted(module, currentLecture._id))
      {
        return "check";
      }
      else {
        return "button"
      }
    }
    const previousLecture = module.lectures[lectureIndex - 1];
    if(this.isLectureCompleted(module, currentLecture._id)){
      return "check";
    }
    else if (this.isLectureCompleted(module, previousLecture._id) && !this.isLectureCompleted(module, currentLecture._id))
    {
      return "button"
    }
    else {
      return "null"
    }
  }
}
