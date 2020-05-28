import { Component, OnInit, Inject , HostListener} from '@angular/core';
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
import { environment } from 'src/environments/environment';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  topPlanners: TopPlanner[];
  proUrl : string;

  ngOnInit(): void {
    this.user.getUserId().subscribe(res => {
        this.proUrl = '/profile/'+ res.pk;
    })
    this.topPlaners.getTopPlanners().subscribe(tp=>{this.topPlanners =tp;});
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
    private topPlaners : TopPlannersService,
    private user : UserService,
    private followSerivce : FollowService
  ) {
    this.followSerivce.updateFollow.subscribe(res=> {
      this.followingState = res[1];
    })
   }


  onFollow() {
    this.profileService.onFollow(this.id).subscribe(res =>{
      if(res.status == 'Followed'){
        this.followingState = "Following";
        this.followSerivce.updateFollow.emit([this.id,"Following"]);
      }
      else if( res.status== 'Requested'){
        this.followingState = "Reuested";
      }

    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      height: '400px',
      width: '600px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
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
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
