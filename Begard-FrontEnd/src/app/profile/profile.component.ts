import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { ProfileService, ProfileHeader } from './profile.service';
import { TopPlannersService } from '../top-planners.service';
import { TopPlanner } from '../top-planner';
import { UserService } from '../user.service';
import { FollowService } from '../follow.service';


export interface DialogData {
  userId: string;
  username: string;
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

  ngOnInit(): void {
    this.user.getUserId().subscribe(res => {
      this.proUrl = '/profile/' + res.pk;
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
      this.imgUrl = 'http://127.0.0.1:8000' + res.profile_image;
      this.followingState = res.following_state;
      alert(this.followingState)
      if (this.followingState == "Follow") {
        this.allowFollowRequest = true;
      }
    });

  }

  userName: string;
  postNum: number;
  follwersNum: number;
  follwingsNum: number;
  imgUrl: string;
  followingState: string;

  animal: string;
  name: string;
  id: number;


  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private topPlaners: TopPlannersService,
    private user: UserService,
    private followSerivce: FollowService
  ) {
    this.followSerivce.updateFollow.subscribe(res => {
      this.followingState = res[1];
    })
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
    const dialogRef = this.dialog.open(UnfollowDialog, {
      height: 'auto',
      minWidth: '600px',
      data: { username: this.userName, userId: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
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

  constructor(
    public dialogRef: MatDialogRef<UnfollowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private followServce: FollowService) {
    this.username += data.username;
    this.userId = data.userId;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUnfollow() {
    //alert(this.username + "  " + this.userId)
    this.dialogRef.close();
  }
}
