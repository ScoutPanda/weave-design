import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SharedDataService } from './services/shareddata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharedDataService]
})
export class AppComponent {
  constructor(public auth: AuthService, public sharedDataService: SharedDataService){
    sharedDataService.horMax = 1000;
  }
  title = 'app works!';
}
