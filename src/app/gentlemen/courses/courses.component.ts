import {Component, ViewChild} from '@angular/core';
import {User} from "../../models/user.model";
import {Course} from "../../models/courses/course.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";
import {CoursesService} from "../../service/genlemen/courses.service";
import {ProgressService} from "../../service/genlemen/progress.service";
import {UserProperty} from "../../models/user-property.enum";
import {Module} from "../../models/courses/module.model";
import {Lecture} from "../../models/courses/lecture.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatAccordion} from "@angular/material/expansion";
import {ModuleProperty} from "../../models/courses/module-property.enum";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {

  user!: User;
  courses!: Course[];
  progress: any;

  panelOpenState = false;

  selectedCourse: Course | null = null; // Initialize the selectedCourse as null
  selectedModule: Module | null = null; // Initialize the selectedCourse as null
  selectedLecture: Lecture | null = null; // Initialize the selectedCourse as null

  videoUrl!: SafeResourceUrl;
  isLoading: boolean = true;

  @ViewChild('accordion') accordion!: MatAccordion;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private userService: UserService,
    private coursesService: CoursesService,
    private progressService: ProgressService,
  ) {
  }

  async ngOnInit() {
    await this.fetchUser();
    this.getCourses()
  }

  fetchUser() {
    this.user = this.userService.getUser();
    console.log(this.user)
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

  selectModule(module: Module) {
    this.selectedModule = module;
  }

  selectLecture(lecture: Lecture){
    this.selectedLecture = lecture;
    console.log(this.selectedLecture)
    this.videoUrl = this.getYouTubeEmbedUrl(lecture.videoLink);
    // Simulate loading delay (you can adjust the time as needed)
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Set isLoading to false after 2 seconds (adjust as needed)
  }

  isCourseSelected(course: Course) {
    return this.selectedCourse === course;
  }

  isLectureSelected(lecture: Lecture) {
    return this.selectedLecture === lecture;
  }

  isModuleCompleted(moduleId: string | undefined): boolean {
    if (!this.user || !this.user.completedModuleIds) {
      return false;
    }
    return this.user.completedModuleIds.includes(moduleId!);
  }

  isLectureCompleted(module: Module, lectureId: string | undefined): boolean {
    if (!this.user || !this.user.completedLectureIds) {
      return false;
    }
    return this.user.completedLectureIds.some(
      (completedLectureId: string | undefined) =>
        module.lectures.some((lecture) => lecture._id === completedLectureId) &&
        completedLectureId === lectureId
    );
  }

  isLectureCompleted2(lectureId: string): boolean {
    if (!this.user || !this.user || !this.user.completedLectureIds) {
      return false;
    }
    return this.user.completedLectureIds.includes(lectureId);
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

  private getYouTubeEmbedUrl(videoLink: string): SafeResourceUrl {
    // Extract the YouTube video ID from the videoLink
    const videoId = this.getYouTubeVideoId(videoLink);
    // Construct the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    // Mark the URL as safe using DomSanitizer
    return this.domSanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private getYouTubeVideoId(videoLink: string): string {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = videoLink.match(regExp);
    return match && match[1] ? match[1] : '';
  }

  // This function will be triggered when the iframe finishes loading
  onIframeLoad() {
    this.isLoading = false; // Set isLoading to false when the iframe has loaded
  }


  /*LOGIC FOR COMPLETING THE LECTURED, MODULES, COURSES*/

  finishLecture(lectureId: string) {
    if (this.selectedLecture &&
        this.selectedModule &&
        this.selectedLecture.orderNumber === this.selectedModule.lectures.length &&
        this.user[UserProperty.completedModuleIds].includes(this.selectedModule[ModuleProperty.id]!)
    ) {
      this.progressService
        .putUserProgressModule(this.user[UserProperty.id]!, this.selectedModule[ModuleProperty.id]!)
        .subscribe(
          (response: any) => {
            // Mark the lecture as completed in the local progress object
            // @ts-ignore
            this.user[UserProperty.completedModuleIds].push(this.selectedModule[ModuleProperty.id]!);
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });

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

    // Call the service method to update user_progress on the server
    this.progressService
      .putUserProgressLecture(this.user[UserProperty.id]!, lectureId)
      .subscribe(
        (response: any) => {
          // Mark the lecture as completed in the local progress object
          this.user[UserProperty.completedLectureIds].push(lectureId);
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

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
}
