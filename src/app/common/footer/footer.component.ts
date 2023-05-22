import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public selectedRoute: string = '';

  public categories: string[] = ["projects", "about us", "careers", "contact us"];

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

}
