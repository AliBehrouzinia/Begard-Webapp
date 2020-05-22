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


class FollowReq {
  constructor(public userName: string, public proImg: string, public date: string,
    public id: number) { }
}




@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {


  loginStatus$: Observable<boolean>;
  userEmail$: Observable<string>;

  notifDisable: boolean = true;

  notifFlag :boolean = false;


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
  items: FollowReq[] = [];
  public notfiNums;

  ngOnInit(): void {
    this.notifService.getFollowRequests().subscribe(res => {
      this.setItems(res);
    });

    this.notifService.getFollowRequests().subscribe(res => {
      this.notfiNums = res.length;
    });
    this.loginStatus$ = this.authService.isLogedIn;
    this.userEmail$ = this.authService.userEmail;
  }

  setItems(res: ReqUser[]) {
    for (let i = 0; i < res.length; i++) {
      this.items.push(new FollowReq(res[i].username, "http://127.0.0.1:8000" + res[i].profile_img, res[i].date, res[i].id));
    }
  }

  logout() {
    this.authService.logout();
  }

  openDialog(event: Event): void {
 
    if (this.notifDisable == true) {
      this.notifDisable = false;
      this.notifFlag =true;
    }
    else {
      this.notifDisable = true;
    }
  }
  onAccept(item: FollowReq) {
    this.notifService.onAction('accept', item.id).subscribe(res => {
      this.removeItem(item);
    });

  }


  onAllPage(){
    if(this.notifFlag == false)
    {
      this.notifDisable = true;
    }
    this.notifFlag = false;
  }

  onNotif(){
    this.notifFlag = true;
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

