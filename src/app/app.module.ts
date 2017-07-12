import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './login/login.component';
import { PatternMakerComponent } from './pattern-maker/pattern-maker.component';
import { ColorPickerModule } from 'angular2-color-picker';

import { MyGlobalsService } from './services/myglobals.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    ColorPickerModule,
  ],
  declarations: [
    AppComponent,
    NotFoundComponent,
    NavbarComponent,
    HomeComponent,
    DesignComponent,
    HelpComponent,
    LoginComponent,
    PatternMakerComponent,
  ],
  providers: [
    MyGlobalsService
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
  constructor(router: Router){
  }
}
