import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { MatMenuModule } from '@angular/material/menu';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  loginStatus$: Observable<boolean>;
  userEmail$: Observable<string>;



  constructor(public authService: AuthService, public matIconRegistry: MatIconRegistry, public domSanitizer: DomSanitizer) {
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
}
