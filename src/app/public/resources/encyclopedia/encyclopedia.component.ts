import {Component, OnInit} from '@angular/core';
import {EncyclopediaService} from "../../../service/encyclopedia.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-encyclopedia',
  templateUrl: './encyclopedia.component.html',
  styleUrls: ['./encyclopedia.component.css']
})
export class EncyclopediaComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: any | null = null;
  selectedTopic: any | null = null;

  html: SafeHtml | undefined;

  constructor(
    private encyclopediaService: EncyclopediaService,
    public sanitizer: DomSanitizer) {
  }
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

  selectCategory(category: any): void {
    this.selectedCategory = category;
  }

  deselectCategory(): void {
    this.selectedCategory = null;
  }

  toggleSubcategory(subcategory: any) {
    subcategory.expanded = !subcategory.expanded;
  }

  selectTopic(subcategory: any){
    if(this.selectedTopic == subcategory)
    {
      this.selectedTopic = null
    }
    else{
      this.selectedTopic = subcategory;
      this.html = this.sanitizer.bypassSecurityTrustHtml(subcategory.info);
    }
  }
}
