import { Component, OnInit , Inject} from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { MatMenuModule } from '@angular/material/menu';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    public dialog: MatDialog) {
    //to add custom icon
    this.matIconRegistry.addSvgIcon(
      "begard_logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/begard_icon.svg")
    );
  }

  ngOnInit(): void {
    this.loginStatus$ = this.authService.isLogedIn;
    this.userEmail$ = this.authService.userEmail;
  }

  logout() {
    this.authService.logout();
  }

  onNotif(){
    
  }

  openDialog(event :Event): void {
    
    
    const dialogRef = this.dialog.open(NotifComponent, {
      width: '250px',
      height: '300px',
      data: {name: this.name, animal: this.animal},
      position: {
        top: '50px',
        left:  '70%'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.animal = result;
    });
  }
}

interface ReqUser{
   userName : string;
   disable: boolean
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class NotifComponent {
  imgUrl = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  items : ReqUser[]=[{userName: 'eatmore18',disable: false},
{userName:'alibehruz1',disable: false},
{userName:'alibehruz2',disable: false},
{userName:'alibehruz3',disable: false},
{userName:'alibehruz4',disable: false},
{userName:'alibehruz5',disable: false},
{userName:'alibehruz6',disable: false},
{userName:'alibehruz7',disable: false},
{userName:'alibehruz8',disable: false}
];
onClear(item: ReqUser) {
  item.disable= true;
}
  constructor(
    public dialogRef: MatDialogRef<NotifComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}