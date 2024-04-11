import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {Route} from "./constants/route.constants";
import {PublicComponent} from "./public/public.component";
import {LandingComponent} from "./public/landing/landing.component";
import {AiComponent} from "./ai/ai.component";
import {EventOrganizationComponent} from "./event-organization/event-organization.component";
import {LogInComponent} from "./features/log-in/log-in.component";
import {SignInComponent} from "./features/sign-in/sign-in.component";
import {AuthGuard} from "./constants/auth.guard";
import {LearnComponent} from "./gentlemen/learn/learn.component";
import {GentlemenComponent} from "./gentlemen/gentlemen.component";
import {DiscourseComponent} from "./gentlemen/discourse/discourse.component";
import {AccountComponent} from "./gentlemen/account/account.component";
import {AdminComponent} from "./admin/admin.component";
import {WcidComponent} from "./admin/home/wcid/wcid.component";
import {EditChannelsComponent} from "./admin/home/edit-channels/edit-channels.component";
import {ResourcesComponent} from "./public/resources/resources.component";
import {QrcodeGeneratorComponent} from "./public/utilities/qrcode-generator/qrcode-generator.component";
import {LandingUtilitiesComponent} from "./public/utilities/landing-utilities/landing-utilities.component";
import {UserResolver} from "./resolvers/user.resolver";
import {SoonComponent} from "./public/common/soon/soon.component";
import {UtilitiesComponent} from "./public/utilities/utilities.component";
import {LifestyleComponent} from "./public/lifestyle/lifestyle.component";
import {CreateEmailComponent} from "./admin/newsletter/create-email/create-email.component";
import {
  DisplayEmailCalendarComponent
} from "./admin/newsletter/display-email/display-email-calendar/display-email-calendar.component";
import {ResolverResponse} from "./constants/resolver-response.constants";
import {EmailResolver} from "./resolvers/email.resolver";
import {AdminGuard} from "./constants/admin.guard";
import {EditCoursesComponent} from "./admin/gentlemen/edit-courses/edit-courses.component";
import {CoursesComponent} from "./gentlemen/courses/courses.component";
import {EncyclopediaComponent} from "./public/resources/encyclopedia/encyclopedia.component";
import {EditEncyclopediaComponent} from "./admin/utilities/edit-encyclopedia/edit-encyclopedia.component";


const routes: Routes = [
  {
    path: Route.EMPTY,
    component: PublicComponent,
    children: [
      {
        path: Route.EMPTY,
        component: LandingComponent,
      },
      {
        path: Route.UTILITIES,
        component: UtilitiesComponent,
        //component: SoonComponent,
        children: [
          {
            path: Route.EMPTY,
            component: LandingUtilitiesComponent,
          },
          {
            path: Route.QRCODE,
            component: QrcodeGeneratorComponent,
          },
        ]
      },
      {
        path: Route.ENCYCLOPEDIA,
        component: EncyclopediaComponent,
        //component: SoonComponent,
      },
      {
        path: Route.LIFESTYLE,
        component: LifestyleComponent,
        //component: SoonComponent,
      },
      {
        path: Route.RESOURCES,
        component: ResourcesComponent,
      },

      {
        path: Route.EVENTORGANISATION,
        component: EventOrganizationComponent,
      },
      {
        path: Route.LOGIN,
        component: LogInComponent,
      },
      {
        path: Route.SIGNUP,
        component: SignInComponent,
      },
      {
        path: Route.AI,
        component: AiComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: Route.GENTLEMEN,
    component: GentlemenComponent,
    canActivate: [AuthGuard],
    resolve: {user: UserResolver}, // Add the resolver here
    children: [
      {
        path: Route.EMPTY,
        component: DiscourseComponent,
      },
      {
        path: Route.COURSES,
        component: CoursesComponent,
      },
      {
        path: Route.ACCOUNT,
        component: AccountComponent,
      },
    ],
  },
  {
    path: Route.ADMIN,
    component: AdminComponent,
    //canActivate: [AdminGuard], // Apply the admin guard to the route and its children
    //resolve: {user: UserResolver}, // Add the resolver here
    children: [
      {
        path: Route.NEWSLETTEREMAIL + Route.SEPARATOR + Route.ID,
        component: CreateEmailComponent,
        resolve: {
          [ResolverResponse.EMAIL]: EmailResolver,
        },
      },
      {
        path: Route.WHATCANIDO,
        component: WcidComponent,
      },
      {
        path: Route.ENCYCLOPEDIA,
        component: EditEncyclopediaComponent,
      },
      {
        path: Route.CHANNELS,
        component: EditChannelsComponent,
      },
      {
        path: Route.COURSES,
        component: EditCoursesComponent,
      },
      {
        path: Route.NEWSLETTERCALENDAR,
        component: DisplayEmailCalendarComponent,
      },
      {
        path: Route.NEWSLETTEREMAIL,
        component: CreateEmailComponent,
      },
    ],
  },
  /*{
    path: '**',
    redirectTo: Route.EMPTY,
  },*/
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {useHash: false}),
    //RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'}),
    CommonModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
