import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  public email: string = 'koira';

  constructor(private auth: AuthService) { }

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }

  getEmail(){
    let profile = localStorage.getItem("profile");
    if (profile != null){
      profile = JSON.parse(profile);
      this.email = profile['email'];
    }else{
      this.email = 'koira';
    }
  }

  loggedIn(){
    return this.auth.loggedIn();
  }

  ngOnInit() {
  }

}
