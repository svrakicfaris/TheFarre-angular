import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('whoami') myElement!: ElementRef;

  category:string[] = ['who am i', 'what can i do', 'what i did']

  public selectedRoute: string = '';

  styleMenu = "display: none";


  constructor(
    private activatedRoute: ActivatedRoute,
    router: Router,
    private renderer: Renderer2,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.selectedRoute = ((event as NavigationEnd).url)?.substring(1);
    });
  }

  ngOnInit(): void {
  }

  scrollToComponent(componentId: string): void {
    const targetComponent = document.getElementById(componentId);
    // @ts-ignore
    const targetComponentPosition = targetComponent.offsetTop - 30;
    this.renderer.setProperty(document.documentElement, 'scrollTop', targetComponentPosition);
  }

  showDiv() {
    var div = document.getElementById("myDiv");
    // @ts-ignore
    div.style.display = "block";
    // @ts-ignore
    div.classList.add("fade-in");
    // @ts-ignore
    div.classList.remove("fade-out");
  }

  hideDiv() {
    var div = document.getElementById("myDiv");
    // @ts-ignore
    div.classList.add("fade-out");
    // @ts-ignore
    div.classList.remove("fade-in");
    setTimeout(function() {
      // @ts-ignore
      div.style.display = "none";
    }, 1000); // wait for the animation to complete before hiding the div
  }

}
