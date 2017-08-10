import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService) { }

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }

  ngOnInit() {
  }

}
