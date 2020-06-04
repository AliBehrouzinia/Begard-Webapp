import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { TopPlannersService } from '../top-planners.service';
import { TopPlanner } from '../top-planner';
import { UserService } from '../user.service';
import { FollowService } from '../follow.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { PlanService, MyPlan } from '../plan.service';

export interface DialogData {
  userId: string;
  username: string;
  unfollow: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  allowFollowRequest = false;
  topPlanners: TopPlanner[];
  proUrl: string;
  isOwnPro: boolean;

  userName: string;
  postNum: number;
  follwersNum: number;
  follwingsNum: number;
  imgUrl: string;
  followingState: string;
  plans = []

  animal: string;
  name: string;
  id: number;


  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private planService: PlanService,
    private router: Router,
    private profileService: ProfileService,
    private topPlaners: TopPlannersService,
    private user: UserService,
    private followSerivce: FollowService
  ) {
    this.followSerivce.updateFollow.subscribe(res => {
      this.followingState = res[1];
      if (this.followingState == "Follow") {
        this.allowFollowRequest = true;
      } else {
        this.allowFollowRequest = false;
      }
    })
  }

  ngOnInit(): void {
    this.user.getUserId().subscribe(res => {
      this.proUrl = '/profile/' + res.pk;
      this.route.params.subscribe(params => {
        if (res.pk == params['id']) {
          this.isOwnPro = true;
        }
        else {
          this.isOwnPro = false;
        }
      })
    })
    this.topPlaners.getTopPlanners().subscribe(tp => { this.topPlanners = tp; });
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.profileService.getHeaderData(this.id).subscribe(res => {
      console.log(res);
      this.userName = res.username;
      this.follwersNum = res.followers_count;
      this.follwingsNum = res.followings_count;
      this.postNum = res.posts_count;
      this.imgUrl = environment.baseUrl + res.profile_image;
      this.followingState = res.following_state;
      if (this.followingState == "Follow") {
        this.allowFollowRequest = true;
      }
    });

    this.planService.getUserPlans(this.id).subscribe(plans => {
      for (let i = 0; i < plans.length; i++) {
        this.plans.push({
          id: plans[i].id
          , destination_city: plans[i].destination_city
          , creation_date: this.setDate(plans[i].creation_date)
          , cover: this.setCoverUrl(plans[i].cover)
          , userId: plans[i].user
        })
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

  goToPlan(id){
    this.router.navigate(['/myplan' , id]);
  }

  onFollow() {
    this.profileService.onFollow(this.id).subscribe(res => {
      if (res.status == 'Followed') {
        this.followingState = "Unfollow";
        this.allowFollowRequest = false;
        this.followSerivce.updateFollow.emit([this.id, "Unfollow"]);
      }
      else if (res.status == 'Requested') {
        this.followingState = "Requested";
        this.allowFollowRequest = false;
      }
    });
  }

  openDialog(): void {
    let dialogRef;
    if (this.followingState == 'Requested') {
      dialogRef = this.dialog.open(UnfollowDialog, {
        height: 'auto',
        minWidth: '600px',
        data: { username: this.userName, userId: this.id, unfollow: false }
      });
    } else {
      dialogRef = this.dialog.open(UnfollowDialog, {
        height: 'auto',
        minWidth: '600px',
        data: { username: this.userName, userId: this.id, unfollow: true }
      });
    }
  }

  goToHome() {
    this.router.navigate(['/homepage']);
  }

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
}


@Component({
  selector: 'unfollow-dialog',
  templateUrl: './unfollow-dialog.html',
})
export class UnfollowDialog {
  username = "";
  userId;
  message;
  constructor(
    public dialogRef: MatDialogRef<UnfollowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private followServce: FollowService,
    private snackBar: MatSnackBar
  ) {
    this.username += data.username;
    this.userId = data.userId;
    if (data.unfollow) {
      this.message = "Do you want to unfollow " + this.username + " ?"
    } else {
      this.message = "Do you want to remove request for " + this.username + " ?"
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUnfollow() {
    if (this.data.unfollow) {
      this.followServce.unfollow(this.userId).subscribe(
        status => { this.handleUnfollowResponse(status, "unfollowed") }
      )
    }
    else {
      this.followServce.removeRequest(this.userId).subscribe(
        status => { this.handleUnfollowResponse(status, "request removed") }
      )
    }
    this.dialogRef.close();
  }

  handleUnfollowResponse(status, mes) {
    if (status == "200") {
      this.openSnackBar(mes + " successfuly")
      this.followServce.updateFollow.next([this.userId, "Follow"])
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
