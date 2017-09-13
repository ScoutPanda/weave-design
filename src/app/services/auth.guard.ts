import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {

  constructor(private authService : AuthService) {
  }

  canActivate() {
    if(this.authService.loggedIn()) return true;
  }

  canDeactivate(){
    if(localStorage.getItem("canvasIsEmpty") === "true"){
      alert("Canvas cannot be empty when exporting");
      localStorage.setItem('canvasIsEmpty', 'false');
      return false;
    }
    if(localStorage.getItem('isDirty') === 'true'){
      if(confirm('You might have unsaved changes, are you sure you want to leave?')){
        localStorage.setItem('isDirty', 'false');
        return true;
      }
      else{
        return false;
      }
    }
    return true;
  }
}