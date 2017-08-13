import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CanvasListComponent } from './canvas-list.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userId: String;
  showCanvases: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    if(this.userId === localStorage.getItem("id_token")){
      this.showCanvases = true;
    }else{
      this.router.navigate(['/']);
    }
  }
}
