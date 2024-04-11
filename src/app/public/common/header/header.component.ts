import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {AuthService} from "../../../service/auth.service";
import {UserService} from "../../../service/user.service";
import {UserProperty} from "../../../models/user-property.enum";

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
    private router: Router,
    private renderer: Renderer2,
    public authService: AuthService,
    public userService: UserService,
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
    if (window.location.href !== 'https://www.thefarre.com') {
      window.location.href = 'https://www.thefarre.com/#' + componentId;
    }

    const targetComponent = document.getElementById(componentId);
    if (targetComponent) {
      const targetComponentPosition = targetComponent.offsetTop - 30;
      this.renderer.setProperty(document.documentElement, 'scrollTop', targetComponentPosition);
    }
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

  logout() {
    this.authService.clearToken()
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  getUser(){
    return !!this.userService.getUser();
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }

  redirectToLifestylePage() {
    this.router.navigate(['/lifestyle']); // Replace 'lifestyle' with your desired route for lifestyle page
  }

  redirectToAccount() {
    this.router.navigate(['/account']); // Replace 'account' with your desired route for the account page
  }

  redirectToResourcesPage() {
    this.router.navigate(['/account']); // Replace 'account' with your desired route for the account page
  }
}
