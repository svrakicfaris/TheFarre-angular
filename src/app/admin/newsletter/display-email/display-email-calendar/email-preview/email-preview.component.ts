import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.css']
})
export class EmailPreviewComponent implements OnInit{

  public html!: SafeHtml;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EmailPreviewComponent>,
              private router: Router,
              public sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void{
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.data.text);
  }

  editEmail() {
    this.dialogRef.close(); // Close the dialog
    console.log(this.data._id)
    this.router.navigate(['/admin/newsletter-email/' + this.data._id]);
  }
}
