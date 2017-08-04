import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DesignComponent } from './design/design.component';
import { PatternMakerComponent } from './pattern-maker/pattern-maker.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'help', component: HelpComponent},
  { path: 'login', component: LoginComponent},
  { path: 'design', component: DesignComponent},
  { path: 'maker', component: PatternMakerComponent},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
