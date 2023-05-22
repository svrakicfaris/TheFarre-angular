import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbCarouselModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MainComponent} from "./main/main.component";
import {HeaderComponent} from "./common/header/header.component";
import {HomeComponent} from './home/home.component';
import {TitleComponent} from './home/title/title.component';
import {WhoAmIComponent} from './home/who-am-i/who-am-i.component';
import {WhatCanIDoComponent} from './home/what-can-i-do/what-can-i-do.component';
import {WhatCanITeachComponent} from './home/what-can-i-teach/what-can-i-teach.component';
import {ContactFormComponent} from "./common/contact-form/contact.form.component";
import {FooterComponent} from "./common/footer/footer.component";
import { AiComponent } from './ai/ai.component';
import {UserService} from "./service/user.service";


@NgModule({
  declarations: [
    AppComponent,
    AiComponent,
    ContactFormComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    MainComponent,
    TitleComponent,
    WhoAmIComponent,
    WhatCanIDoComponent,
    WhatCanITeachComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    NgbCarouselModule,
    NgbModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  providers: [
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
