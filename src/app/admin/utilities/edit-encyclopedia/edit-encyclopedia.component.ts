import { Component } from '@angular/core';
import { EncyclopediaService } from '../../../service/encyclopedia.service';
import {Lecture} from "../../../models/courses/lecture.model";
import {Course} from "../../../models/courses/course.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HttpEvent, HttpResponse} from "@angular/common/http";
import {ImagesService} from "../../../service/images.service";

@Component({
  selector: 'app-edit-encyclopedia',
  templateUrl: './edit-encyclopedia.component.html',
  styleUrls: ['./edit-encyclopedia.component.css']
})
export class EditEncyclopediaComponent {
  categories: any[] = [];
  selectedCategory: any | null = null;
  selectedTopic: any | null = null;

  editingSubcategory: any | null = null; //Lecture which was edited

  safeHtml: SafeHtml | undefined; // Define the safeHtml property

  selectedFiles?: FileList;
  message: string[] = [];
  imageLinks: string[] = [];

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
    defaultFontSize: '5',
    fonts: [
      {class: 'naratif', name: 'Naratif'},
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
    ],
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'] // disable the image upload button
    ],
    sanitize: false
  };

  constructor(
    private encyclopediaService: EncyclopediaService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private imagesService: ImagesService,

  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.encyclopediaService.getEncyclopedia().subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading encyclopedia data:', error);
      }
    );
  }

  addCategory(): void{

  }

  selectCategory(category: any): void {
    this.selectedCategory = category;
  }

  deselectCategory(): void {
    this.selectedCategory = null;
    this.selectedTopic = null; // Clear selected topic when deselecting category

  }

  toggleSubcategory(subcategory: any) {
    subcategory.expanded = !subcategory.expanded;
  }

  selectTopic(subcategory: any) {
    this.selectedTopic = subcategory;
    this.editingSubcategory = null;
    // Call a function to sanitize and update the safeHtml property
    this.updateSafeHtml();
  }

  updateSafeHtml() {
    if (this.selectedTopic) {
      const safeHtmlString: string = this.selectedTopic.info;
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(safeHtmlString);
    }
  }

  isSubcategorySelected(topic: any) {
    return this.selectedTopic === topic;
  }

  addSubcategory(parent: any): void {
    if (!parent.subCategories) {
      parent.subCategories = [];
    }
    parent.subCategories.push({ name: 'New Subcategory', info: 'New info text', subCategories: [] });
    this.updateEncyclopedia()
  }

  editSubcategory(subcategory: any) {
    this.editingSubcategory = subcategory; // Create a copy of the course object to avoid modifying the original
    this.selectedTopic = subcategory;
  }

  cancelEditSubcategory() {
    this.editingSubcategory = null;
  }

  deleteSubcategory(parent: any, subcategory: any) {
    const index = this.selectedCategory.subCategories.indexOf(subcategory);
    if(subcategory.subCategories.length != 0)
    {
      this.snackBar.open("Unable to delete, check the subcategories first", 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return
    }
    parent.subCategories.splice(index, 1);
    this.updateEncyclopedia();
  }

  saveSubcategory(parent: any, subcategory: any) {
    if (this.selectedCategory && this.editingSubcategory) {
      const index = parent.subCategories.indexOf(this.editingSubcategory);
      console.log(subcategory)
      console.log(this.editingSubcategory)

      if (index !== -1) {
        // Update the properties of the editing subcategory if needed
        parent.subCategories[index] = { ...this.editingSubcategory };
        this.updateEncyclopedia();
        this.editingSubcategory = null;
      }
    }
  }

  updateEncyclopedia(): void {
    this.encyclopediaService.putEncyclopedia(this.selectedCategory).subscribe(
      (response) => {
        console.log('Encyclopedia updated successfully:', response);
        // Handle any additional actions or notifications here
      },
      (error) => {
        console.error('Error updating encyclopedia:', error);
        // Handle error and display error message if needed
      }
    );
  }


  onInputClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.stopPropagation();
    }
  }

  /*Image upload*/
  selectFiles(event: any): void {
    this.message = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.imagesService.upload(file, 'website').subscribe({
      next: (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.message.push(msg);
          // Update imageLinks array with the uploaded file link
          this.imageLinks.push(event.body.mediaLink);
        }
      },
      error: (err: any) => {
        const msg = 'Could not upload the file: ' + file.name;
        this.message.push(msg);
      }
    });
  }

  public removeImage(link: string): void{
    this.imageLinks.forEach( (item, index) => {
      if(link === item) this.imageLinks.splice(index, 1);
    });
  }

  copyCode(link: string) {
    const htmlCode = `<img style="height: 100%; width: 300px" src="${link}">`;
    const pastedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlCode).toString();

    navigator.clipboard.writeText(htmlCode).then(() => {
      this.snackBar.open('Text copied to clipboard', 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    }, () => {
      this.snackBar.open('Unable to copy text to clipboard', 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    });
  }

}
