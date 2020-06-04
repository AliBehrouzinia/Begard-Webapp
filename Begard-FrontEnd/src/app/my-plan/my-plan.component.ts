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
import { FollowService } from '../follow.service';

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
  topPlanners = [];
  allTopPlanners = [];
  userId
  proUrl


  constructor(public dialog: MatDialog, private myPlanService: MyPlanService, private profileService: ProfileService
    , private router: Router, private route: ActivatedRoute, private user: UserService
    , private topPlannerService: TopPlannersService
    , private followService: FollowService
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

    this.topPlannerService.getTopPlanners().subscribe(tp => { this.allTopPlanners = tp; this.initTopPlanners(tp) })
    this.updateMyPlans();
  }

  updateMyPlans() {
    this.myPlans = [];
    this.myPlanService.getMyPlans().subscribe(myPlans => {
      this.plansCount = myPlans.length;
      for (let i = 0; i < myPlans.length; i++) {
        this.myPlans.push(new MyPlan(myPlans[i].id, myPlans[i].destination_city, this.setDateCreation(myPlans[i].creation_date), this.setCoverUrl(myPlans[i].cover)))
      };
    })

    this.followService.userFollowing$.subscribe(addFlag => {
      if (addFlag != null) {
        if (addFlag) {
          this.followingCount += 1;
        } else {
          this.followingCount -= 1;
        }
      }
    })

    this.followService.updateFollow.subscribe(res => {
      if (res[1] == "Following" || res[1] == "Requested") {
        this.replaceTopPlanner(res[0]);
        if (res[1] == "Following")
          this.openSnackBar("followed successfully")
        else {
          this.openSnackBar("requested successfully")
        }
      }
    })

  }

  setDateCreation(d) {
    let date = new Date(d);
    let day = date.getUTCDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let currentDate = new Date();
    let dayDiff = ((currentDate.getFullYear() - year) * 365 + (currentDate.getMonth() - month) * 30 + (currentDate.getUTCDate() - day))
    if (dayDiff >= 2 && dayDiff < 7) {
      return "last week";
    } else if (dayDiff == 1) {
      return "Yesterday";
    } else if (dayDiff == 0) {
      return "Today";
    } else {
      return day + "/" + month + "/" + year;
    }
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

  goToPlan(id) {
    this.router.navigate(['/myplan', id]);
  }

  setProUrl(id) {
    this.proUrl = '/profile/' + id;
  }

  openDialog(): void {
  }

  refresh() {
    location.reload()
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

  initTopPlanners(tp) {
    for (let i = 0; i < Math.min(tp.length, 6); i++) {
      this.topPlanners.push(this.allTopPlanners[0])
      this.allTopPlanners.splice(0, 1);
    }
  }

  replaceTopPlanner(id) {
    for (let i = 0; i < this.topPlanners.length; i++) {
      if (id == this.topPlanners[i].pk) {
        if (this.allTopPlanners.length > 0) {
          this.topPlanners.splice(i, 1, this.allTopPlanners[0])
          this.allTopPlanners.splice(0, 1)
        }
        else
          this.topPlanners.splice(i, 1)
      }
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

