// newsletter.component.ts
import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {GenderDialogComponent} from './gender-dialog/gender-dialog.component';
import {UserService} from "../../../service/user.service";
import {User} from "../../../models/user.model";
import {UserProperty} from "../../../models/user-property.enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  @Input() layout: string = 'horizontal'; // 'horizontal' or 'vertical'

  email: string = '';
  user!: User;
  data: any;
  public form!: FormGroup;
  public userProperty = UserProperty;
  public emailExists: Boolean | undefined;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
    ) {}

  ngOnInit(): void{
    this.getUser();
    if(this.user === undefined)
    {
      this.data ={
        email: "",
        gender: "",
      };
    }
    this.form = this.formBuilder.group({
      'email': [this.user?.[UserProperty.email] || '', [Validators.email, Validators.required]],
      'gender': [this.user?.[UserProperty.gender] || ''],
    });
  }

  openGenderDialog() {
    const dialogRef = this.dialog.open(GenderDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subscribeToNewsletter(result.gender);
      }
    });
  }

  subscribeToNewsletter(gender: string) {
    this.form.value.gender = gender;
    this.userService.subscribeToNewsletter(this.form.value).subscribe(
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

  unsubscribeUser() {
    this.user.newsletter = false;
    this.userService.updateUser(this.user).subscribe(
      (response) => {
        // Handle successful update here
        console.log('User updated successfully');
      },
      (error) => {
        // Handle error here
        console.error('Error updating user:', error);
      }
    );
  }


  getUser(){
    this.user = this.userService.getUser()
  }
}
