import { Component, OnInit } from '@angular/core';
import { MyPlanService } from './../my-plan.service'
import { MyPlan } from '../my-plan';

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.css']
})
export class MyPlanComponent implements OnInit {
  myPlans = [];

  constructor(private myPlanService: MyPlanService) { }

  ngOnInit(): void {
    this.myPlanService.getMyPlans().subscribe(myPlans => {
      for (let i = 0; i < myPlans.length; i++) {
        this.myPlans.push(new MyPlan(myPlans[i].id , myPlans[i].destinaion_city , this.setDate(myPlans[i].creation_date) ,this.setCoverUrl(myPlans[i].cover)))
      };
    })
  }

  setDate(date) {
    let d = new Date(date);
    return "" + d.getFullYear() + "/" + d.getUTCMonth() + "/" + d.getUTCDate();
  }

  setCoverUrl(url){
    return '127.0.0.1:8000/' + url;
  }
}

