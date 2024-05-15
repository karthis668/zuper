import { Component, OnInit } from '@angular/core';
import * as userlogData from '../../../assets/userinput.json';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import moment from "moment";



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
  consolidatedUserData: any = [];
  timeLogResponse: any = [];

  constructor(public http: HttpClient, public router : Router) {
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
      this.timeLogResponse = response;
      console.log(this.timeLogResponse);
      this.getConsolidatedUserData();
      this.userData.forEach((val: any, index: number) => {
        console.log(val)
        let obj = val;
        let filterTimelog: any = response.filter(
          (timelog: any) => timelog.user_id == val.user_id
        );
        for (let key of filterTimelog) {
          console.log(key);
          if (key.type == 'CLOCK_IN') {
            obj.clock_in_time = key.clocked_time;
          } else if (key.type == 'CLOCK_OUT') {
            obj.clock_out_time = key.clocked_time;
          }
        }
        timelogArr.push(obj)
      });

      console.log(timelogArr);
    });
  }

  navigateUserDetails(data: any){
    console.log(data);
    // -----firstway of passing data-------
    // it will show the data on url;(drawback)
    // simple pass user_id into url and get the user details from some Api service
    // or we can pass the whole data to query params
    // this.router.navigate(['user-details'],{queryParams:{id: data.user_id}});

    // --------secondWay of passing data-------
    // it won't show any data on url
    this.router.navigate(['user-details'], {
      state: {
        userData: JSON.stringify(data),
      },
    });
  }


  getConsolidatedUserData() {
    let newArr: any = [];
    console.log(this.timeLogResponse)
    this.userData.forEach((val: any) => {
      let obj = val;
      let filterTimelog: any = this.timeLogResponse.filter(
        (timelog: any) => timelog.user_id == val.user_id
      );
      console.log(filterTimelog)
      for (let key of filterTimelog) {
        // console.log(key);
        if (key.type == 'CLOCK_IN') {
          obj.clock_in_time = key.clocked_time;
        } else if (key.type == 'CLOCK_OUT') {
          obj.clock_out_time = key.clocked_time;
        }
        let startTime = moment(obj.start_time, 'hh:mm:ss');
        let endTime = moment(obj.end_time, 'hh:mm:ss');
        let totalHours = endTime.diff(startTime, 'hours');
        let totalMinutes = endTime.diff(startTime, 'minutes');
        let clearMinutes = totalMinutes % 60;
        obj.work_time = totalHours  +'.' + clearMinutes;

        let checkInstartTime = moment(obj.clock_in_time, 'hh:mm:ss');
        let chckOutendTime = moment(obj.clock_out_time, 'hh:mm:ss');
        let CtotalHours = chckOutendTime.diff(checkInstartTime, 'hours');
        let CtotalMinutes = chckOutendTime.diff(checkInstartTime, 'minutes');
        let CclearMinutes = CtotalMinutes % 60;
        let overTime = CtotalHours  +'.' + CclearMinutes;
        let calculatedOvertime = Math.floor(+overTime -  +obj.work_time);
        obj.overTime = calculatedOvertime > 0 ? calculatedOvertime.toString() : "0";
        // console.log(totalHours  +'.' + clearMinutes );
      }
      console.log(obj)
      newArr.push(obj);
    });
    console.log(newArr);
    this.consolidatedUserData = newArr;
  }

}
