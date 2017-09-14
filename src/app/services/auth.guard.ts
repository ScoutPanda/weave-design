import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from "@angular/router";

@Injectable()
export class AuthGuard {

  constructor(private authService : AuthService, private router: Router) {
  }

  canActivate() {
    if(this.authService.loggedIn()) return true;
    else
    {
      this.router.navigate(['/']);
      return false;
    } 
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