import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpEvent, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";
import {UserService} from "../../../service/user.service";
import {UserProperty} from "../../../models/user-property.enum";


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBase64: any = '';
  isCropped!: Boolean;

  //added
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  imagePath: any = '';


  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    private http: HttpClient,
    private userService: UserService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    if (event.base64 != null) {
      console.log(event, base64ToFile(event.base64));
    }
  }

  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  confirmCroppedImage(): void {
    if (!this.croppedImage) {
      return;
    }

    /*this.userService.uploadProfilePicture(this.croppedImage).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const msg = 'Uploaded the file successfully: ' + this.croppedImage.name;
        }
      },
      error: (err: any) => {
        const msg = 'Could not upload the file: ' + this.croppedImage.name;
      }
    }); */


    // Send the image to the Node.js server
    this.http.post<any>(`${environment.serverNodeUrl}/image-upload`, { image: this.croppedImage, username: this.getUserUsername(), directory: 'user'}).subscribe(
      (response: { imagePath: string | undefined }) => {
        if (response.imagePath) {
          // Emit the imagePath to the parent component
          this.imagePath = response.imagePath;
          console.log("Image uploaded successfully. Image path:", this.imagePath);
        }
        this.dialogRef.close(this.imagePath);
      },
      (error: any) => {
        console.error('Error uploading image:', error);
        this.dialogRef.close();
      }
    );
  }




  base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/png' }); // Set the correct image type here
  }


  cancelCropping(): void {
    this.croppedImage = '';
  }

  saveCroppedImage(): void {
    this.isCropped = true;
  }

  getUserUsername(){
    return this.userService.getUser()[UserProperty.username];
  }
}
