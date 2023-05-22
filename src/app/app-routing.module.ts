import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {Route} from "./constants/route.constants";
import {MainComponent} from "./main/main.component";
import {HomeComponent} from "./home/home.component";
import {AiComponent} from "./ai/ai.component";


const routes: Routes = [
  {
    path: Route.EMPTY,
    component: MainComponent,
    children: [
      {
        path: Route.EMPTY,
        component: HomeComponent,
      },
      {
        path: Route.AI,
        component: AiComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: Route.EMPTY,
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: false }),
    //RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'}),
    CommonModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
