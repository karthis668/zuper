import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, RouterState } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  data:any;
  routeState: any;

  constructor(public router: Router,public activateRoute: ActivatedRoute) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.routeState = this.router.getCurrentNavigation()?.extras.state;
      if (this.routeState) {
        this.data = this.routeState?.userData
          ? JSON.parse(this.routeState?.userData)
          : '';
      }
    }
    console.log(this.data)
  }

  ngOnInit() {

  }

}
