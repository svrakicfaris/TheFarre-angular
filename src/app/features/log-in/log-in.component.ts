import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Route} from '../../constants/route.constants';
import {Router} from '@angular/router';
import {Observable} from "rxjs";
import {User} from "../../models/user.model";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  pathToSignup:string = '/signup';

  form!: FormGroup;

  public user: Observable<User> | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,

  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  handleFormSubmit() {
    this.form!.markAllAsTouched();

    if (this.form!.valid) {
      this.userService.login({ ...this.form!.value }).subscribe(() => {
        this.userService.fetchUser().subscribe(()=> {

          this.router.navigate([Route.GENTLEMEN]);
        })
      })}
    else this.form!.setErrors({ unauthenticated: true });
  }

  isFieldMissing(fieldName: string) {
    const control = this.form.get(fieldName);
    return control?.invalid && control?.touched;
  }
}
