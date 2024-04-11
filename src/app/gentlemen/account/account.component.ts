import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import { filter } from "rxjs";
import { UserService } from "../../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {ImageUploadComponent} from "./image-upload/image-upload.component";
import {GenderDialogComponent} from "../../public/resources/newsletter/gender-dialog/gender-dialog.component";
import {FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserProperty} from "../../models/user-property.enum";
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public selectedRoute: string = '';
  user!: User;

  public form!: FormGroup;
  public userProperty = UserProperty;
  public emailExists: Boolean | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    public authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.selectedRoute = ((event as NavigationEnd).url)?.substring(1);
    });
  }

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    this.user = this.userService.getUser();
  }

  logout() {
    this.authService.clearToken()
  }

  redirectToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  editedUser: any = {};
  isEditingProfile: boolean = false;

  enableEditMode() {
    this.isEditingProfile = true;
    this.copyUserToEditedUser();
  }

  saveProfileChanges() {
    // Perform validation if needed
    // Update the user object with the edited values
    console.log(this.user.id)
    console.log(this.user._id)
    this.user.firstName = this.editedUser.firstName;
    this.user.lastName = this.editedUser.lastName;
    this.user.gender = this.editedUser.gender;
    this.user.username = this.editedUser.username;
    this.user.email = this.editedUser.email;
    this.user.imageURL = this.editedUser.imageURL;

    // Call the updateUser function from UserService
    this.userService.updateUser(this.user).subscribe(
      () => {
        console.log("User updated successfully.");
        this.disableEditMode();
      },
      (error) => {
        console.error("Error updating user:", error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    );
  }

  cancelEditMode() {
    this.disableEditMode();
    this.resetEditedUser();
  }

  disableEditMode() {
    this.isEditingProfile = false;
  }

  copyUserToEditedUser() {
    this.editedUser.firstName = this.user.firstName;
    this.editedUser.lastName = this.user.lastName;
    this.editedUser.gender = this.user.gender;
    this.editedUser.username = this.user.username;
    this.editedUser.email = this.user.email;
    this.editedUser.imageURL = this.user.imageURL;
  }

  resetEditedUser() {
    this.editedUser.firstName = this.user.firstName;
    this.editedUser.lastName = this.user.lastName;
    this.editedUser.gender = this.user.gender;
    this.editedUser.email = this.user.email;
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      width: '500px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(imagePath => {
      console.log("Received imagePath in AccountComponent:", imagePath);
      if (imagePath) {
        this.editedUser.imageURL = imagePath;
        console.log("Updated imageURL:", this.user.imageURL);
        // Save the updated user to the server or perform any necessary action
        // ...
      }
    });
  }

  unsubscribeUser() {
    this.user.newsletter = false;
    this.userService.updateUser(this.user).subscribe(
      (response) => {
        this.snackBar.open(response.message, 'Close', {
          duration: 3000, // Adjust the duration as desired
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'success-snackbar'
        });        console.log('User updated successfully');
      },
      (error) => {
        this.snackBar.open(error, 'Close', {
          duration: 3000, // Adjust the duration as desired
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });        console.error('Error updating user:', error);
      }
    );
  }

  subscribeToNewsletter() {
    this.userService.subscribeToNewsletter(this.user).subscribe(
      (response) => {
        this.snackBar.open(response.message, 'Close', {
          duration: 3000, // Adjust the duration as desired
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'success-snackbar'
        });
        this.user.newsletter = true;
        // Add any success message or further actions here
      },
      (error) => {
        console.error('Error: ', error);
        // Handle any error message or further actions here
        if (error.status === 409) {
          // Email already exists, display a snackbar message to the user
          this.snackBar.open(error, 'Close', {
            duration: 3000, // Adjust the duration as desired
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          // You can also set a flag or variable to control the display of the message in the template
          // For example:
          // this.emailExists = true;
        }
      }
    );
  }


  isFieldMissing(fieldName: string) {
    const control = this.form.get(fieldName);
    return control?.invalid && control?.touched;
  }


}
