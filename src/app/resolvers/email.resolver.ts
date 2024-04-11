import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Route} from "../constants/route.constants";
import {User} from "../models/user.model";
import {UserService} from "../service/user.service";
import {Email} from "../models/email.model";
import {NewsletterService} from "../service/newsletter/newsletter.service";

@Injectable({providedIn: 'root'})
export class EmailResolver implements Resolve<Email> {

  constructor(private newsletterService: NewsletterService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Email> | Promise<Email> | Email{
    const id = route.paramMap.get(Route.ID.substring(1));
    const email = this.newsletterService.getNewsletterEmail(id!);
    if(!email) {
      throw 'Item not found!';
    }
    return email;
  }
}
