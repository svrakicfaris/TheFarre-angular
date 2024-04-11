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
import {PublicComponent} from "./public/public.component";
import {HeaderComponent} from "./public/common/header/header.component";
import {LandingComponent} from './public/landing/landing.component';
import {TitleComponent} from './public/landing/title/title.component';
import {WhoAmIComponent} from './public/landing/who-am-i/who-am-i.component';
import {WhatCanIDoComponent} from './public/landing/what-can-i-do/what-can-i-do.component';
import {WhatCanITeachComponent} from './public/landing/what-can-i-teach/what-can-i-teach.component';
import {FooterComponent} from "./public/common/footer/footer.component";
import { AiComponent } from './ai/ai.component';
import {PersonService} from "./service/person.service";
import { EventOrganizationComponent } from './event-organization/event-organization.component';
import { LogInComponent } from './features/log-in/log-in.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {UserService} from "./service/user.service";
import {MatInputModule} from "@angular/material/input";
import {SocketIoModule} from "ngx-socket-io";
import {MatMenuModule} from "@angular/material/menu";
import { LearnComponent } from './gentlemen/learn/learn.component';
import { GentlemenComponent } from './gentlemen/gentlemen.component';
import {GentlemenHeaderComponent} from "./gentlemen/gentlemen-header/gentlemen-header.component";
import { DiscourseComponent } from './gentlemen/discourse/discourse.component';
import { AccountComponent } from './gentlemen/account/account.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { WcidComponent } from './admin/home/wcid/wcid.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { EditChannelsComponent } from './admin/home/edit-channels/edit-channels.component';
import {ChannelService} from "./service/genlemen/channel.service";
import {AuthGuard} from "./constants/auth.guard";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ImageUploadComponent} from "./gentlemen/account/image-upload/image-upload.component";
import {ImageCropperModule} from "ngx-image-cropper";
import { BecomeTheGentlemenComponent } from './public/landing/become-the-gentlemen/become-the-gentlemen.component';
import { UtilitiesComponent } from './public/utilities/utilities.component';
import { ResourcesComponent } from './public/resources/resources.component';
import { LifestyleComponent } from './public/lifestyle/lifestyle.component';
import { QrcodeGeneratorComponent } from './public/utilities/qrcode-generator/qrcode-generator.component';
import { LandingUtilitiesComponent } from './public/utilities/landing-utilities/landing-utilities.component';
import { ContactFormComponent } from './public/resources/contact-form/contact-form.component';
import { NewsletterComponent } from './public/resources/newsletter/newsletter.component';
import { GenderDialogComponent } from './public/resources/newsletter/gender-dialog/gender-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {UserChannelLastMessageSeenService} from "./service/genlemen/user_channel_last_message_seen.service";
import { SoonComponent } from './public/common/soon/soon.component';
import { CreateEmailComponent } from './admin/newsletter/create-email/create-email.component';
import { DisplayEmailCalendarComponent } from './admin/newsletter/display-email/display-email-calendar/display-email-calendar.component';
import { DisplayEmailListComponent } from './admin/newsletter/display-email/display-email-list/display-email-list.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import { EmailPreviewComponent } from './admin/newsletter/display-email/display-email-calendar/email-preview/email-preview.component';
import {EmailResolver} from "./resolvers/email.resolver";
import {UserResolver} from "./resolvers/user.resolver";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import { TheFarrePrinciplesComponent } from './public/landing/the-farre-principles/the-farre-principles.component';
import { EditCoursesComponent } from './admin/gentlemen/edit-courses/edit-courses.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { ConfirmationDialogComponent } from './admin/confirmation-dialog/confirmation-dialog.component';
import { CoursesComponent } from './gentlemen/courses/courses.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { EncyclopediaComponent } from './public/resources/encyclopedia/encyclopedia.component';
import { EditEncyclopediaComponent } from './admin/utilities/edit-encyclopedia/edit-encyclopedia.component';

@NgModule({
  declarations: [
    AppComponent,
    AiComponent,
    EventOrganizationComponent,
    FooterComponent,
    HeaderComponent,
    GentlemenHeaderComponent,
    LandingComponent,
    PublicComponent,
    TitleComponent,
    WhoAmIComponent,
    WhatCanIDoComponent,
    WhatCanITeachComponent,
    EventOrganizationComponent,
    LogInComponent,
    SignInComponent,
    LearnComponent,
    GentlemenComponent,
    DiscourseComponent,
    AccountComponent,
    AdminComponent,
    AdminHeaderComponent,
    WcidComponent,
    EditChannelsComponent,
    ImageUploadComponent,
    BecomeTheGentlemenComponent,
    UtilitiesComponent,
    ResourcesComponent,
    LifestyleComponent,
    QrcodeGeneratorComponent,
    LandingUtilitiesComponent,
    ContactFormComponent,
    NewsletterComponent,
    GenderDialogComponent,
    SoonComponent,
    CreateEmailComponent,
    DisplayEmailCalendarComponent,
    DisplayEmailListComponent,
    EmailPreviewComponent,
    TheFarrePrinciplesComponent,
    EditCoursesComponent,
    ConfirmationDialogComponent,
    CoursesComponent,
    EncyclopediaComponent,
    EditEncyclopediaComponent,
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
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule,
    SocketIoModule,
    DragDropModule,
    MatDialogModule,
    ImageCropperModule,
    MatSelectModule,
    AngularEditorModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    PersonService,
    UserService,
    UserChannelLastMessageSeenService,
    AuthGuard,
    MatDialog,
    EmailResolver,
    UserResolver
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
