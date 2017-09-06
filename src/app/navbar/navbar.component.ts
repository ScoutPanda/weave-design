import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  public email: string = '';

  constructor(private auth: AuthService) { }

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }

  getEmail(){
    let email = localStorage.getItem("email");
    if (email != null){
      this.email = email;
    }else{
      this.email = '';
    }
  }

  /*getUserId(){
    return localStorage.getItem("id_token");
  }*/

  loggedIn(){
    return this.auth.loggedIn();
  }

  ngOnInit() {
  }

}
