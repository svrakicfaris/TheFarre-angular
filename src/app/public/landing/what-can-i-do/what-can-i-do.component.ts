import { Component, OnInit } from '@angular/core';
import {WcidService} from "../../../service/home/wcid.service";

@Component({
  selector: 'app-what-can-i-do',
  templateUrl: './what-can-i-do.component.html',
  styleUrls: ['./what-can-i-do.component.css']
})
export class WhatCanIDoComponent implements OnInit {

  categories: any[] = [];

  constructor(
    private wcidService: WcidService
  ) { }

  ngOnInit(): void {
    this.wcidService.getCategories().subscribe(
      (data: any[]) => {
        this.categories = data;
      },
      (error) => {
        console.log('Error fetching categories:', error);
      }
    );
  }

}
