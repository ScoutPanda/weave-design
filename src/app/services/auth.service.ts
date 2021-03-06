import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from "@angular/router";

declare var Auth0Lock: any;

@Injectable()
export class AuthService {


  private options = {
    loginAfterSignUp: false,
    auth: {
      redirect: false
    },
    languageDictionary: {
      success: {
        signUp: 'Thanks for signing up. Please confirm your email before signing in.'
      }
    }
  };

  lock = new Auth0Lock(
    '07yOOxsIRAqf2z09zMuF7mdKDpFQUvra', 
    'weave-design.eu.auth0.com', 
    this.options
  )

  constructor(private router: Router) {
    
  }

  login() {
    this.lock.show();
    this.lock.on("authenticated", authResult => {
      this.lock.getUserInfo(authResult.accessToken, function (error, profile){
        if(error){
          return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('accessToken', authResult.accessToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('email', profile.email);
      });
    });
  }

  logout() {
    localStorage.removeItem('id_token')
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    localStorage.removeItem('email');
    this.isInUserMenu();
  }

  isInUserMenu(){
    if(this.router.isActive("/user", true)){
      this.router.navigate(['/']);
    }
  }

  getUser(){
    
  }

  loggedIn(): boolean {
    return tokenNotExpired("id_token");
  }
}
