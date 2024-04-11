import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../service/user.service";
import {UserProperty} from "../models/user-property.enum";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  user!: User;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user = this.userService.getUser()
    console.log(this.user)
    // Check if the user is logged in (has a token)
    if (this.user[UserProperty.isAdmin]) {
      return true; // Allow access to the route
    }

    // User is not logged in, redirect to the login page
    //return this.router.createUrlTree(['/login']);
    return this.router.createUrlTree(['/login']);
  }
}
