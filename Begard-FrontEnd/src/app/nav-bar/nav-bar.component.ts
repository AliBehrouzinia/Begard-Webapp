import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { MatMenuModule } from '@angular/material/menu';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  animal: string;
  name: string;

  loginStatus$: Observable<boolean>;
  userEmail$: Observable<string>;



  constructor(public authService: AuthService, public matIconRegistry: MatIconRegistry, public domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    public http: HttpClient) {
    //to add custom icon
    this.matIconRegistry.addSvgIcon(
      "begard_logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/begard_icon.svg")
    );
  }
  public notfiNums;

  ngOnInit(): void {

    this.authService.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http.get<ReqUser[]>('http://127.0.0.1:8000/followers/requests/',
        {
          headers: new HttpHeaders({ 'Authorization': token })
        }
      );
    })).subscribe(res => {
       console.log(res);
       this.notfiNums= res.length;
       
    });

    this.loginStatus$ = this.authService.isLogedIn;
    this.userEmail$ = this.authService.userEmail;
  }

  logout() {
    this.authService.logout();
  }

  onNotif() {

  }

  openDialog(event: Event): void {


    const dialogRef = this.dialog.open(NotifComponent, {
      width: '250px',
      height: '300px',
      data: { name: this.name, animal: this.animal },
      position: {
        top: '50px',
        left: '70%'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.animal = result;
    });
  }
}

interface ReqUser {
  id: number,
  request_from: number,
  date: string,
  profile_img: string,
  username: string
}
class FollowReq{
  constructor(public userName : string, public proImg : string, public date : string,
    public id : number){}
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class NotifComponent implements OnInit {
  imgUrl = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  items: FollowReq[] = [];

  constructor(
    public dialogRef: MatDialogRef<NotifComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private auth: AuthService) { }
  ngOnInit() {
    
     this.auth.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http.get<ReqUser[]>('http://127.0.0.1:8000/followers/requests/',
        {
          headers: new HttpHeaders({ 'Authorization': token })
        }
      );
    })).subscribe(res => {
       console.log(res);
       for(let i=0;i<res.length;i++){
         this.items.push(new FollowReq(res[i].username,res[i].profile_img,res[i].date,res[i].id))
       }
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAccept(item : FollowReq){

    this.auth.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      var url = 'http://127.0.0.1:8000/followers/requests/' + item.id + '/?action=accept';
      return this.http.patch(url,{},
        {
          headers: new HttpHeaders({ 'Authorization': token })
        }
      );
    })).subscribe();
    

  }
  onDecline(item : FollowReq){

    this.auth.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      var url = 'http://127.0.0.1:8000/followers/requests/' + item.id + '/?action=reject';
      return this.http.patch(url,{},
        {
          headers: new HttpHeaders({ 'Authorization': token })
        }
      );
    })).subscribe();

  }

}