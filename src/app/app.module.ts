import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Renderer2 } from '@angular/core';
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
import { PatternMakerComponent } from './pattern-maker/pattern-maker.component';
import { CanvasDrawingModule } from './shared/canvas-drawing/canvas-drawing.module';

import { MyGlobalsService } from './services/myglobals.service';
import { CanvasService } from './services/canvas.service';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './callback/callback.component';
import { UserComponent } from './user/user.component';
import { CanvasListComponent } from './user/canvas-list.component';
import { AuthGuard } from './services/auth.guard';
import { B64ToBlobService } from './services/b64-to-blob.service';
import { SharedDataService } from './services/shareddata.service';
import { CompressService } from './services/compress.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    CanvasDrawingModule
  ],
  declarations: [
    AppComponent,
    NotFoundComponent,
    NavbarComponent,
    HomeComponent,
    DesignComponent,
    HelpComponent,
    PatternMakerComponent,
    CallbackComponent,
    UserComponent,
    CanvasListComponent
  ],
  providers: [
    MyGlobalsService,
    AuthService,
    CanvasService,
    AuthGuard,
    B64ToBlobService,
    SharedDataService,
    CompressService
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
  constructor(router: Router){
  }
}
