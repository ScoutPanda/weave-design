import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';
import { PatternMakerComponent } from './pattern-maker/pattern-maker.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'help', component: HelpComponent},
  { path: 'design', component: DesignComponent, canDeactivate: [AuthGuard]},
  { path: 'maker', component: PatternMakerComponent, canDeactivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
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
