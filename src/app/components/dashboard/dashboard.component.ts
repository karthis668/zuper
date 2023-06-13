import { Component, OnInit } from '@angular/core';
import * as userlogData from '../../../assets/userinput.json';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData: any = [];
  timelogData: any ;
  url: string = '../../../assets/timeloginput.json';

  constructor(public http: HttpClient) {
    this.userData  = (userlogData as any).default;
    console.log(this.userData);
   }

  ngOnInit() {
  this.getTimelogInput();
  }

  getTimelogInput(){
    let timelogArr: any = [];
    this.http.get("../../../assets/timelogInput.json").subscribe(res => {
      let response = Object(res);
      this.userData.forEach((val: any, index: number) => {
        console.log(val)
        let obj = val;
        let filterTimelog: any = response.filter(
          (timelog: any) => timelog.user_id == val.user_id
        );
        for (let key of filterTimelog) {
          // console.log(key);
          if (key.type == 'CLOCK_IN') {
            obj.clock_in_time = key.clocked_time;
          } else if (key.type == 'CLOCK_OUT') {
            obj.clock_out_time = key.clocked_time;
          }
        }
      });

      console.log(res);
    });
  }

  navigateUserDetails(data: any){
    console.log(data)
  }

}
