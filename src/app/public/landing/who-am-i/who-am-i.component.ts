import { Component, OnInit, ElementRef } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.component.html',
  styleUrls: ['./who-am-i.component.css']
})
export class WhoAmIComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }
}
