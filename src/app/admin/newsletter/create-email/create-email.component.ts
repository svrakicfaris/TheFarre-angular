import { Component } from '@angular/core';
import { NewsletterService } from "../../../service/newsletter/newsletter.service";
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ActivatedRoute} from "@angular/router";
import {Email} from "../../../models/email.model";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.css']
})
export class CreateEmailComponent {
  emailId: string | null = null; // Added property to store the email ID
  subject: string = '';
  text: string = '';
  scheduleDate: Date | null = null;
  scheduleTime: Date | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private newsletterService: NewsletterService,
    private route: ActivatedRoute
  ) {}

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: 'Naratif',
    defaultFontSize: '12px',
    fonts: [
      {class: 'naratif', name: 'Naratif'},
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
    ],
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'] // disable the image upload button
    ],
    sanitize: true
  };

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.emailId = params['_id'];
      if (this.emailId) {
        this.loadEmail();
      }
    });
  }



  loadEmail() {
    if (this.emailId) {
      this.newsletterService.getNewsletterEmail(this.emailId).subscribe(
        (email) => {
          this.subject = email.subject;
          this.text = email.text;
          this.scheduleDate = email.scheduleDate;
          this.scheduleTime = email.scheduleTime;
        },
        (error) => {
          console.error('Failed to load email:', error);
        }
      );
    }
  }

  submitForm() {
    console.log("there")
    const newEmail = {
      subject: this.subject,
      text: this.text,
      scheduleDate: this.scheduleDate,
      scheduleTime: this.scheduleTime,
      sent: false
    };

    if (this.emailId) {
      // Editing an existing email
      this.newsletterService.updateNewsletterEmail(this.emailId, newEmail).subscribe(
        (response) => {
          console.log('Email updated successfully!');
          this.snackBar.open(response.message, 'Close', {
            duration: 3000, // Adjust the duration as desired
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'success-snackbar',
          });
        },
        (error) => {
          console.error('Failed to update email:', error);
          this.snackBar.open(error, 'Close', {
            duration: 3000, // Adjust the duration as desired
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'error-snackbar',
          });
        }
      );
    } else {
      // Creating a new email
      this.newsletterService.createNewsletterEmail(newEmail).subscribe(
        () => {
          console.log('Email created successfully!');
          // Handle success, e.g., show a success message
        },
        (error) => {
          console.error('Failed to create email:', error);
          // Handle error, e.g., show an error message
        }
      );
    }
  }

  sendNow(){
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format: "HH:MM"

    const newEmail = {
      subject: this.subject,
      text: this.text,
      scheduleDate: date,
      scheduleTime: time,
      sent: false
    };

    if (this.emailId) {
      this.newsletterService.deleteNewsletterEmail(this.emailId).subscribe(
        (response) => {
          console.log('Email deleted successfully!');
          this.snackBar.open(response.message, 'Close', {
            duration: 3000, // Adjust the duration as desired
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'success-snackbar',
          });
        },
        (error) => {
          console.error('Failed to delete email:', error);
          this.snackBar.open(error, 'Close', {
            duration: 3000, // Adjust the duration as desired
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'error-snackbar',
          });
        }
      );
    }

    this.newsletterService.sendNewsletterEmail(newEmail).subscribe(
      (response: any) => {
        console.log('Email sent successfully!');
        this.snackBar.open(response.message, 'Close', {
          duration: 3000, // Adjust the duration as desired
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'success-snackbar',
        });
      },
      (error) => {
        console.error('Failed to send email:', error);
        this.snackBar.open(error, 'Close', {
          duration: 3000, // Adjust the duration as desired
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'error-snackbar',
        });
      }
    );
  }

}
