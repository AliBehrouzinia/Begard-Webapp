import { Component, OnInit, HostListener } from '@angular/core';
import { MyPlanService } from './../my-plan.service'
import { ProfileService } from './../profile.service'
import { MyPlan } from '../my-plan';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { TopPlannersService } from '../top-planners.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletePlanService } from '../delete-plan.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.css']
})
export class MyPlanComponent implements OnInit {
  myPlans = [];
  username
  profileImage;
  plansCount = 0;
  followersCount = 0;
  followingCount = 0;
  topPlanners
  userId
  proUrl


  constructor(public dialog: MatDialog, private myPlanService: MyPlanService, private profileService: ProfileService
    , private router: Router, private route: ActivatedRoute, private user: UserService
    , private topPlannerService: TopPlannersService
    , private deletePlanService: DeletePlanService
    , private snackBar: MatSnackBar
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset >= 490) {
      let element1 = document.getElementById('leftbar');
      element1.classList.add('sticky');
      let element2 = document.getElementById('rightbar');
      element2.classList.add('sticky');
      let element3 = document.getElementById('content');
      element3.classList.add('sticky');
    } else {
      let element = document.getElementById('leftbar');
      element.classList.remove('sticky');
      let element2 = document.getElementById('rightbar');
      element2.classList.remove('sticky');
      let element3 = document.getElementById('content');
      element3.classList.remove('sticky');
    }
  }

  ngOnInit(): void {
    this.user.getUserId().subscribe(user => {
      this.userId = user.pk;
      this.setProUrl(user.pk);
      this.profileService.getProfile(user.pk).subscribe(profile => {
        this.username = profile.username;
        this.profileImage = environment.baseUrl + profile.profile_image;
        this.followersCount = profile.followers_count;
        this.followingCount = profile.followings_count;
      })
    })

    this.topPlannerService.getTopPlanners().subscribe(tp => { this.topPlanners = tp; })
    this.updateMyPlans();
  }

  updateMyPlans() {
    this.myPlans = [];
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
    return environment.baseUrl + url;
  }
  goToHome() {
    this.router.navigate(['/homepage']);
  }
  goToProfile() {
    this.router.navigate(['/profile', this.userId]);
  }

  goToPlan(id){
    this.router.navigate(['/myplan' , id]);
  }

  setProUrl(id) {
    this.proUrl = '/profile/' + id;
  }

  openDialog(): void {
  }

  onDelete(planId) {
    this.deletePlanService.delete(planId).subscribe(status => {
      this.handleDeleteResponse(status);
    })
  }
  handleDeleteResponse(status) {
    if (status == "200") {
      this.updateMyPlans()
      this.openSnackBar("deleted successfuly")
    } else {
      this.openSnackBar("something went wrong!")
    }
  }

  openSnackBar(message) {
    this.snackBar.open(
      message, "", {
      duration: 3 * 1000
    }
    );
  }
}

