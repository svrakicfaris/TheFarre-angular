import {Component, Renderer2} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {

  constructor(
    private router: Router,
  ) {

  }

  isHomeActive: boolean = false;
  isGentlemenActive: boolean = false;
  isNewsletterActive: boolean = false;

  toggleHome() {
    this.isHomeActive = !this.isHomeActive;
    this.isGentlemenActive = false;
    this.isNewsletterActive = false;

  }

  toggleGentlemen() {
    this.isGentlemenActive = !this.isGentlemenActive;
    this.isHomeActive = false;
    this.isNewsletterActive = false;
  }

  toggleNewsletter() {
    this.isNewsletterActive = !this.isNewsletterActive;
    this.isGentlemenActive = false;
    this.isHomeActive = false;
  }

  handleRoute(route: string){
    this.router.navigate(['/admin/' + route])
  }

  redirectBack(): void {
    this.router.navigate(['/gentlemen/account']);
  }
}
