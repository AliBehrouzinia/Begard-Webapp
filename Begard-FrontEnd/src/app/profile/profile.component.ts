import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { ProfileService, ProfileHeader } from './profile.service';


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


  ngOnInit(): void {
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
    private profileService: ProfileService) { }


  onFollow() {
    console.log(this.id);
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
