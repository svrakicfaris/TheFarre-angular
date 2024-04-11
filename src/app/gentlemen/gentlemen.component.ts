import {Component} from '@angular/core';
import {UserService} from "../service/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../models/user.model";

@Component({
  selector: 'app-gentlemen',
  templateUrl: './gentlemen.component.html',
  styleUrls: ['./gentlemen.component.css']
})
export class GentlemenComponent {

  user: User | undefined;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute
  ) {
    this.user = this.route.snapshot.data['user']; // Access the resolved user data

  }

  ngOnInit(): void {
    this.userService.getUser()
  }
}
