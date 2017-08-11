import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  lock = new Auth0Lock('07yOOxsIRAqf2z09zMuF7mdKDpFQUvra', 'weave-design.eu.auth0.com', {
    auth: {
      //redirect: false
      //redirectUrl: 'http://localhost:4200/callback'
    }
  })

  constructor() { 
    this.lock.on("authenticated", authResult => {
      this.lock.getUserInfo(authResult.accessToken, function (error, profile){
        if(error){
          return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('accessToken', authResult.accessToken);
        localStorage.setItem('profile', JSON.stringify(profile));
      });
    });
  }

  login() {
    this.lock.show();
  }

  logout() {
    localStorage.removeItem('id_token')
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    /*this.lock.logout({

    })*/
    }

  loggedIn(): boolean {
    return tokenNotExpired("id_token");
  }
}
