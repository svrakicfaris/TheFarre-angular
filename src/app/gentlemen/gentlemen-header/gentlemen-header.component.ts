import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {UserProperty} from "../../models/user-property.enum";

@Component({
  selector: 'app-gentlemen-header',
  templateUrl: './gentlemen-header.component.html',
  styleUrls: ['./gentlemen-header.component.css']
})
export class GentlemenHeaderComponent implements OnInit {

  public selectedRoute: string = '';

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

  redirectToLearn(): void {
    this.router.navigate(['/gentlemen/courses']);
  }
  redirectToGenlemen(): void {
    this.router.navigate(['/gentlemen']);
  }
  redirectToHome(): void {
    this.router.navigate(['/']);
  }
  redirectToAccount(): void {
    this.router.navigate(['/gentlemen/account']);
  }

  getUserImage(){
    return this.userService.getUser()[UserProperty.imageURL]
  }

}
