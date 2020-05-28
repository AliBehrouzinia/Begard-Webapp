import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { MatMenuModule } from '@angular/material/menu';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { ReqUser, NotifService } from './notificaton.service';
import { environment } from '../../environments/environment';

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
    public http: HttpClient,
    private notifService: NotifService) {
    //to add custom icon
    this.matIconRegistry.addSvgIcon(
      "begard_logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/begard_icon.svg")
    );
    this.notifService.NotifNumUpdated.subscribe(res => {
      this.notfiNums--;
    });
  }
  public notfiNums;
  public url ;

  ngOnInit(): void {
    this.notifService.getFollowRequests().subscribe(res => {
      this.notfiNums = res.length;
    });
    this.loginStatus$ = this.authService.isLogedIn;
    this.userEmail$ = this.authService.userEmail;
    this.url = environment.baseUrl;
  }

  logout() {
    this.authService.logout();
  }

  openDialog(event: Event): void {
    const dialogRef = this.dialog.open(NotifComponent, {
      width: '250px',
      height: '300px',
      data: { name: this.name, animal: this.animal },
      position: {
        top: '50px',
        left: '80%'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
}


class FollowReq {
  constructor(public userName: string, public proImg: string, public date: string,
    public id: number) { }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class NotifComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotifComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private auth: AuthService,
    private notifService: NotifService) { }

  items: FollowReq[] = [];


  ngOnInit() {

    this.notifService.getFollowRequests().subscribe(res => {
      this.setItems(res);
    });
  }

  setItems(res : ReqUser[]){
    for (let i = 0; i < res.length; i++) {
      this.items.push(new FollowReq(res[i].username, environment.baseUrl + res[i].profile_img, res[i].date, res[i].id));
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAccept(item: FollowReq) {
    this.notifService.onAction('accpet', item.id).subscribe(res => {
      this.removeItem(item);
    });

  }

  onDecline(item: FollowReq) {
    this.notifService.onAction('reject', item.id).subscribe(res => {
      this.removeItem(item);
    });


  }

  removeItem(item: FollowReq) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == item.id) {
        this.items.splice(i, 1);
        this.notifService.NotifNumUpdated.emit();
      }
    }
  }

}