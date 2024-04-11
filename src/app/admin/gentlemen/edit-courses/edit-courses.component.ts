import {Component} from '@angular/core';
import {Course} from "../../../models/courses/course.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoursesService} from "../../../service/genlemen/courses.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {CourseProperty} from "../../../models/courses/course-property.enum";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from '@angular/material/dialog';
import {Module} from "../../../models/courses/module.model";
import {ModulesService} from "../../../service/genlemen/modules.service";
import {ModuleProperty} from "../../../models/courses/module-property.enum";
import {Lecture} from "../../../models/courses/lecture.model";
import {LecturesService} from "../../../service/genlemen/lectures.service";

@Component({
  selector: 'app-edit-courses',
  templateUrl: './edit-courses.component.html',
  styleUrls: ['./edit-courses.component.css']
})
export class EditCoursesComponent {

  originalCourses: Course[] = []; //courses as received from database

  courses!: Course[]; //received courses for editing

  selectedCourse: Course | null = null; // Course user selected
  selectedModule: Module | null = null; // Course user selected

  differentCoursesOrder = false //is order different from original
  differentModulesOrder = false //is order different from original

  editedCourse: Course | null = null; //Course which was edited
  editedModule: Module | null = null; //Module which was edited
  editedLecture: Lecture | null = null; //Lecture which was edited

  panelOpenState = false;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private coursesService: CoursesService,
    private modulesService: ModulesService,
    private lecturesService: LecturesService,
  ) {
  }

  async ngOnInit() {
    await this.getCourses()

  }

  //Get the data of courses, their modules and lectures
  getCourses() {
    this.coursesService.getCourses().subscribe(
      (courses: Course[]) => {
        this.courses = courses; // Assign the retrieved courses to the courses property
        this.originalCourses = JSON.parse(JSON.stringify(this.courses)); // Copy original received courses
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

    //Necessary, because of the display of save button
    this.differentModulesOrder = false;
    // @ts-ignore
    const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);

    for (let i = 0; i < this.originalCourses[originalCourseIndex].modules.length; i++) {
      // @ts-ignore
      if (this.selectedCourse.modules[i][ModuleProperty.name] !== this.originalCourses[originalCourseIndex].modules[i][ModuleProperty.name]) {
        // @ts-ignore
        this.selectedCourse.modules[i].orderNumber = i + 1;
        this.differentModulesOrder = true;
      }
    }
  }

  selectModule(module: any) {
    this.selectedModule = module; // Save the selected module to the variable
    console.log(this.selectedModule)
  }

  isCourseSelected(course: Course) {
    return this.selectedCourse === course;
  }

  createCourse(): Promise<Course> {
    return new Promise((resolve, reject) =>{
      const data = {
        name: 'New Course', // Set the default name for the new course
        orderNumber: this.courses.length + 1, // Set the order number based on the current number of courses
      };
      this.coursesService.createCourse(data).subscribe(
        (response: any) => {
          const message = response.message;
          const createdCourse = response.course;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.courses.push(createdCourse);

          this.originalCourses = JSON.parse(JSON.stringify(this.courses));
          // Resolve the Promise with the created course
          resolve(createdCourse);
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error getting courses:', error);
          // Reject the Promise with the error
          reject(error);
        }
      );
    })

  }


  editCourseName(course: Course) {
    this.editedCourse = course; // Create a copy of the course object to avoid modifying the original
  }

  saveCourseName() {
    if (this.editedCourse && this.editedCourse.name.trim() !== '') {
      // Update the original course name with the edited name

      const data = {
        ...this.editedCourse
      };
      this.coursesService.updateCourse(data).subscribe(
        (response: any) => {
          const message = response.message;
          const createdCourse = response.course;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // @ts-ignore
          const index = this.courses.findIndex((course) => course._id === this.editedCourse._id);
          if (index !== -1) {
            // @ts-ignore
            this.courses[index].name = this.editedCourse.name;
          }
          this.editedCourse = null; // Reset editedCourse to null to show the course name again
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error updating course:', error);
        }
      );
    }
  }

  cancelEditCourseName() {
    this.editedCourse = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.courses, event.previousIndex, event.currentIndex);
    this.differentCoursesOrder = false;
    for (let i = 0; i < this.originalCourses.length; i++) {
      if (this.courses[i][CourseProperty.name] !== this.originalCourses[i][CourseProperty.name]) {
        this.courses[i].orderNumber = i + 1;
        this.differentCoursesOrder = true;
      }
    }
  }

  saveCourseOrder() {
    // Check if the order of courses in the array matches their orderNumber
    // If not, update the orderNumber and send the updated courses to the backend
    if (this.courses.length > 0) {
      // Send the updated courses to the backend
      this.coursesService.updateCoursesOrder(this.courses).subscribe(
        (response) => {
          this.originalCourses = JSON.parse(JSON.stringify(this.courses));
          const message = response.message;
          this.snackBar.open(message, 'Close', {
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
        }
      );
    }
  }

  deleteCourse(course: Course) {
    // Check if the course has any modules assigned
    if (course.modules != undefined && course.modules.length > 0) {
      this.snackBar.open('Cannot delete course with assigned modules. Please remove modules before deleting the course.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User confirmed the deletion, call deleteCourse from coursesService
        this.coursesService.deleteCourse(course._id!).subscribe(
          (response) => {
            const message = response.message;
            this.snackBar.open(message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            // Remove the deleted course from the courses array
            this.courses = this.courses.filter((c) => c._id !== course._id);
          },
          (error) => {
            this.snackBar.open(error, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error deleting course:', error);
          }
        );
      }
    });
  }

  /*-----------------------------------MODULE FUNCTIONS-----------------------------------*/

  createModule(): Promise<Course> {
    return new Promise((resolve, reject) =>{
      const data = {
        // @ts-ignore
        courseId: this.selectedCourse._id,
        name: 'New Module', // Set the default name for the new course
        // @ts-ignore
        orderNumber: this.selectedCourse.modules.length + 1, // Set the order number based on the current number of courses
      };
      this.modulesService.createModule(data).subscribe(
        (response: any) => {
          const message = response.message;
          const createdModule = response.module;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // @ts-ignore
          this.selectedCourse.modules.push(createdModule);
          console.log(this.selectedCourse)
          // @ts-ignore
          const selectedCourseIndex = this.courses.findIndex((course) => course._id === this.selectedCourse._id);
          if (selectedCourseIndex !== -1) {
            // @ts-ignore
            this.courses[selectedCourseIndex] = this.selectedCourse;
          }


          // Resolve the Promise with the created course
          resolve(createdModule);
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error getting courses:', error);
          // Reject the Promise with the error
          reject(error);
        }
      );
    })
  }

  editModule(module: Module) {
    this.editedModule = module; // Create a copy of the course object to avoid modifying the original
  }
  cancelEditModule() {
    this.editedModule = null;
  }
  saveModule() {
    if (this.editedModule && this.editedModule.name.trim() !== '') {
      // Update the original course name with the edited name

      const data = {
        // @ts-ignore
        ...this.editedModule
      };
      // @ts-ignore
      this.modulesService.updateModule(data).subscribe(
        (response: any) => {
          const message = response.message;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // @ts-ignore
          const index = this.selectedCourse.modules.findIndex((module) => module._id === this.editedModule._id);
          if (index !== -1) {
            // @ts-ignore
            this.selectedCourse.modules[index].name = this.editedModule.name;
          }
          this.editedModule = null; // Reset editedCourse to null to show the course name again
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error updating module:', error);
        }
      );
    }
  }

  deleteModule(module: Module) {
    // Check if the course has any modules assigned
    if (module.lectures != undefined && module.lectures.length > 0) {
      this.snackBar.open('Cannot delete course with assigned modules. Please remove modules before deleting the course.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User confirmed the deletion, call deleteCourse from coursesService
        // @ts-ignore
        this.modulesService.deleteModule(module._id!).subscribe(
          (response) => {
            const message = response.message;
            this.snackBar.open(message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            // Find the index of the original course object in this.originalCourses
            // @ts-ignore
            const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);

            if (originalCourseIndex !== -1) {
              // Filter out the deleted module from the modules array of the original course object
              this.originalCourses[originalCourseIndex].modules = this.originalCourses[originalCourseIndex].modules.filter((m) => m._id !== module._id);
            }
            // Filter out the deleted module from the selectedCourse.modules array
            // @ts-ignore
            this.selectedCourse.modules = this.selectedCourse.modules.filter((m) => m._id !== module._id);
          },
          (error) => {
            this.snackBar.open(error, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error deleting course:', error);
          }
        );
      }
    });
  }

  dropModules(event: CdkDragDrop<string[]>) {
    // @ts-ignore
    moveItemInArray(this.selectedCourse.modules, event.previousIndex, event.currentIndex);
    this.differentModulesOrder = false;
    // @ts-ignore
    const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);

    for (let i = 0; i < this.originalCourses[originalCourseIndex].modules.length; i++) {
      // @ts-ignore
      if (this.selectedCourse.modules[i][ModuleProperty.name] !== this.originalCourses[originalCourseIndex].modules[i][ModuleProperty.name]) {
        // @ts-ignore
        this.selectedCourse.modules[i].orderNumber = i + 1;
        this.differentModulesOrder = true;
      }
    }
    console.log(this.selectedCourse)
    console.log(this.originalCourses)
  }

  onInputClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.stopPropagation();
    }
  }


  saveModulesOrder() {
    // Check if the order of courses in the array matches their orderNumber
    // If not, update the orderNumber and send the updated courses to the backend
    // @ts-ignore
    if (this.selectedCourse.modules.length > 0) {
      // Send the updated courses to the backend
      // @ts-ignore
      this.modulesService.updateModulesOrder(this.selectedCourse.modules).subscribe(
        (response) => {
          // Update the modules array in the original course object
          // @ts-ignore
          const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);
          if (originalCourseIndex !== -1) {
            // @ts-ignore
            this.originalCourses[originalCourseIndex].modules = JSON.parse(JSON.stringify(this.selectedCourse.modules));
          }
          const message = response.message;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.differentModulesOrder = false;
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      );
    }
  }

  /*-----------------------------------LECTURE FUNCTIONS-----------------------------------*/

  createLecture(): Promise<Lecture> {
    return new Promise((resolve, reject) =>{
      const data = {
        name: 'New Lecture', // Set the default name for the new course
        // @ts-ignore
        moduleId: this.selectedModule._id,
        // @ts-ignore
        orderNumber: this.selectedModule.lectures.length + 1, // Set the order number based on the current number of courses
        videoLink: "", // Set the order number based on the current number of courses
      };
      this.lecturesService.createLecture(data).subscribe(
        (response: any) => {
          const message = response.message;
          const createdLecture = response.lecture;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.log(this.selectedModule)
          // @ts-ignore
          this.selectedModule.lectures.push(createdLecture);
          // @ts-ignore
          const selectedCourseIndex = this.courses.findIndex((course) => course._id === this.selectedCourse._id);
          // @ts-ignore
          const selectedModuleIndex = this.courses[selectedCourseIndex].modules.findIndex((module) => module._id === this.selectedModule._id);
          if (selectedModuleIndex !== -1) {
            // @ts-ignore
            this.courses[selectedCourseIndex].modules[selectedModuleIndex] = this.selectedModule;
          }


          // Resolve the Promise with the created course
          resolve(createdLecture);
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error getting courses:', error);
          // Reject the Promise with the error
          reject(error);
        }
      );
    })
  }
  editLecture(lecture: Lecture) {
    this.editedLecture = lecture; // Create a copy of the course object to avoid modifying the original

  }
  cancelEditLecture() {
    this.editedLecture = null;
  }
 /* saveLecture() {
    if (this.editedLecture && this.editedLecture.name.trim() !== '') {
      // Update the original course name with the edited name

      const data = {
        ...this.editedLecture
      };
      this.lecturesService.updateLecture(data).subscribe(
        (response: any) => {
          const message = response.message;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // @ts-ignore
          const selectedCourseIndex = this.courses.findIndex((course) => course._id === this.selectedCourse._id);
          // @ts-ignore
          const selectedModuleIndex = this.courses[selectedCourseIndex].modules.findIndex((module) => module._id === this.selectedModule._id);
          if (selectedModuleIndex !== -1) {
            // @ts-ignore
            this.courses[selectedCourseIndex].modules[selectedModuleIndex].name = this.editedLecture.name;
          }

          this.editedLecture = null; // Reset editedCourse to null to show the course name again
          console.log(this.selectedModule)
          console.log(this.selectedCourse)
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error updating module:', error);
        }
      );
    }
  }*/
  deleteLecture(lecture: Lecture) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User confirmed the deletion, call deleteCourse from coursesService
        this.lecturesService.deleteLecture(lecture._id!).subscribe(
          (response) => {
            const message = response.message;
            this.snackBar.open(message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            // Find the index of the original course object in this.originalCourses
            // @ts-ignore
            const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);
            // @ts-ignore
            const originalModuleIndex = this.originalCourses[originalCourseIndex].modules.findIndex((module) => module._id === this.selectedModule._id);

            if (originalModuleIndex !== -1) {
              // Filter out the deleted module from the modules array of the original course object
              this.originalCourses[originalCourseIndex].modules[originalModuleIndex].lectures = this.originalCourses[originalCourseIndex].modules[originalModuleIndex].lectures.filter((m) => m._id !== lecture._id);
            }
            // Filter out the deleted module from the selectedCourse.modules array
            // @ts-ignore
            this.selectedModule.lectures = this.selectedModule.lectures.filter((m) => m._id !== lecture._id);
            // @ts-ignore
            this.selectedCourse.modules[originalModuleIndex].lectures = this.selectedCourse.modules[originalModuleIndex].lectures.filter((m) => m._id !== lecture._id);
          },
          (error) => {
            this.snackBar.open(error, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error deleting course:', error);
          }
        );
      }
    });
  }
  dropLectures(event: CdkDragDrop<string[]>) {
    // @ts-ignore
    moveItemInArray(this.selectedCourse.modules, event.previousIndex, event.currentIndex);
    this.differentModulesOrder = false;
    // @ts-ignore
    const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);

    for (let i = 0; i < this.originalCourses[originalCourseIndex].modules.length; i++) {
      // @ts-ignore
      if (this.selectedCourse.modules[i][ModuleProperty.name] !== this.originalCourses[originalCourseIndex].modules[i][ModuleProperty.name]) {
        // @ts-ignore
        this.selectedCourse.modules[i].orderNumber = i + 1;
        this.differentModulesOrder = true;
      }
    }
    console.log(this.selectedCourse)
    console.log(this.originalCourses)
  }
  saveLecturesOrder() {
    // Check if the order of courses in the array matches their orderNumber
    // If not, update the orderNumber and send the updated courses to the backend
    // @ts-ignore
    if (this.selectedCourse.modules.length > 0) {
      // Send the updated courses to the backend
      // @ts-ignore
      this.lecturesService.updateLecturesOrder(this.selectedCourse.modules).subscribe(
        (response) => {
          // Update the modules array in the original course object
          // @ts-ignore
          const originalCourseIndex = this.originalCourses.findIndex(c => c._id === this.selectedCourse._id);
          if (originalCourseIndex !== -1) {
            // @ts-ignore
            this.originalCourses[originalCourseIndex].modules = JSON.parse(JSON.stringify(this.selectedCourse.modules));
          }
          const message = response.message;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.differentModulesOrder = false;
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      );
    }
  }

  saveLecture() {
    if (this.editedLecture && this.editedLecture.name.trim() !== '') {
      // Update the original course name with the edited name

      const data = {
        ...this.editedLecture
      };
      this.lecturesService.updateLecture(data).subscribe(
        (response: any) => {
          const message = response.message;
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // @ts-ignore
          const index = this.selectedModule.lectures.findIndex((lecture) => lecture._id === this.editedLecture._id);
          if (index !== -1) {
            // @ts-ignore
            this.selectedModule.lectures[index].name = this.editedLecture.name;
            // @ts-ignore
            this.selectedModule.lectures[index].videoLink = this.editedLecture.videoLink;
          }
          this.editedLecture = null; // Reset editedCourse to null to show the course name again
        },
        (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error updating module:', error);
        }
      );
    }
  }
}
