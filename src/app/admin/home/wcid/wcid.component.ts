import { Component, OnInit } from '@angular/core';
import { WcidService } from '../../../service/home/wcid.service';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-wcid',
  templateUrl: './wcid.component.html',
  styleUrls: ['./wcid.component.css']
})
export class WcidComponent implements OnInit {
  categories: any[] = [];
  work!: string;
  description!: string;
  url!: string;
  _id!: string;
  isEditingCategory: boolean = false;
  editedCategory: any = {};

  constructor(private wcidService: WcidService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.wcidService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Failed to get categories:', error);
      }
    );
  }

  handleSubmit() {
    const data = {
      work: this.work,
      description: this.description,
      url: this.url || '',
      orderNumber: this.categories.length + 1,
      _id: this._id,
    };

    if (this.isEditingCategory) {
      // Call putCategories if editing
      this.wcidService.putCategory(data).subscribe(
        (response) => {
          console.log('Entry updated successfully');
          // Reset the form and editing variables
          this.resetForm();
        },
        (error) => {
          console.error('Failed to update entry:', error);
        }
      );
    } else {
      // Call postCategories if creating new entry
      this.wcidService.postCategory(data).subscribe(
        (response) => {
          console.log('Entry created successfully');
          // Reset the form
          this.resetForm();
        },
        (error) => {
          console.error('Failed to create entry:', error);
        }
      );
    }
  }

  resetForm() {
    this.work = '';
    this.description = '';
    this.url = '';
    this.isEditingCategory = false;
    this.editedCategory = {};
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  onDragStart(event: DragEvent, category: any) {
    event.dataTransfer!.setData('category', JSON.stringify(category));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  insertForm(category: any) {
    this.isEditingCategory = true;
    this.editedCategory = { ...category };
    this.work = this.editedCategory.work;
    this.description = this.editedCategory.description;
    this.url = this.editedCategory.url;
    this._id = this.editedCategory._id;
  }

  cancelEditing() {
    this.isEditingCategory = false;
    this.editedCategory = {};
    this.resetForm();
  }

  updateCategories() {
    this.categories.forEach((category, index) => {
      const updatedCategory = {
        ...category,
        orderNumber: index + 1
      };
      this.wcidService.putCategory(updatedCategory).subscribe(
        (response) => {
          console.log(`Category ${category._id} updated successfully`);
        },
        (error) => {
          console.error(`Failed to update category ${category._id}:`, error);
        }
      );
    });
    this.isEditingCategory = false;
    this.editedCategory = {};
  }


  removeCategory(categoryId: string) {
    const data = {
      _id: categoryId
    };

    this.wcidService.deleteCategory(data).subscribe(
      (response) => {
        console.log('Category deleted successfully');
        // Remove the category from the local array
        this.categories = this.categories.filter((category) => category._id !== categoryId);
        this.updateCategories();
      },
      (error) => {
        console.error('Failed to delete category:', error);
      }
    );
  }



}
