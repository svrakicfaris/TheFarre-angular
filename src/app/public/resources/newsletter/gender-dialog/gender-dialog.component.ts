// gender-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gender-dialog',
  templateUrl: './gender-dialog.component.html',
  styleUrls: ['./gender-dialog.component.css']
})
export class GenderDialogComponent {
  gender: string = '';

  constructor(
    public dialogRef: MatDialogRef<GenderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ gender: this.gender });
  }
}
