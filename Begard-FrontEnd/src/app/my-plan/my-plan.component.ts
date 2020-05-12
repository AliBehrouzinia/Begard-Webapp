import { Component, OnInit } from '@angular/core';
import { MyPlanService } from './../my-plan.service'
import { ProfileService } from './../profile.service'
import { MyPlan } from '../my-plan';
import { Profile } from '../profile';


@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.css']
})
export class MyPlanComponent implements OnInit {
  myPlans = [];
  SERVER_URL = 'http://127.0.0.1:8000';
  profileImage;
  plansCount;
  followersCount;
  followingCount;

  //todo : get this from api
  USER_ID = 3;

  constructor(private myPlanService: MyPlanService, private profileService: ProfileService) { }

  ngOnInit(): void {

    this.profileService.getProfile(this.USER_ID).subscribe(profile => {
      this.profileImage = profile.profile_image;
      this.followersCount = profile.followers_count;
      this.followingCount = profile.followings_count;
    })

    this.myPlanService.getMyPlans().subscribe(myPlans => {
      this.plansCount = myPlans.length;
      for (let i = 0; i < myPlans.length; i++) {
        this.myPlans.push(new MyPlan(myPlans[i].id, myPlans[i].destination_city, this.setDate(myPlans[i].creation_date), this.setCoverUrl(myPlans[i].cover)))
      };
    })

  }

  setDate(date) {
    let d = new Date(date);
    return "" + d.getFullYear() + "/" + d.getUTCMonth() + "/" + d.getUTCDate();
  }

  setCoverUrl(url) {
    return this.SERVER_URL + url;
  }

  
}

