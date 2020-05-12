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
        this.myPlans.push(new MyPlan(myPlans[i].id , myPlans[i].destinaion_city , myPlans[i].creation_date ,myPlans[i].cover))
      };
    })
  }
}

