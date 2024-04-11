import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../models/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserProperty} from "../../models/user-property.enum";
import {Router} from "@angular/router";
import {Route} from "../../constants/route.constants";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  pathToLogin:string = '/login';


  @Output()
  saveUser: EventEmitter<User> = new EventEmitter<User>();

  @Input()
  user: User | undefined;

  public form!: FormGroup;
  public userProperty = UserProperty;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      [UserProperty.id]: [this.user?.[UserProperty.id] || ''],
      [UserProperty.firstName]: [this.user?.[UserProperty.firstName] || '', Validators.required],
      [UserProperty.lastName]: [this.user?.[UserProperty.lastName] || '', Validators.required],
      [UserProperty.username]: [this.user?.[UserProperty.username] || '', Validators.required],
      [UserProperty.email]: [this.user?.[UserProperty.email] || '', [Validators.email, Validators.required]],
      [UserProperty.password]: [this.user?.[UserProperty.password] || '', Validators.required],
      [UserProperty.gender]: [this.user?.[UserProperty.gender] || ''],
    });
  }


  public submit(): void {
    if (!this.form.valid) {
      return;
    }
    this.userService.create(this.form.value).subscribe(value => {
      /*this.router.navigate([Route.ITEMS]);*/
    });
    this.resetForm();
    this.router.navigate([Route.LOGIN]);
  }

  private resetForm(): void {
    this.form.reset();
  }

  isFieldMissing(fieldName: string) {
    const control = this.form.get(fieldName);
    return control?.invalid && control?.touched;
  }

}
