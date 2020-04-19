import { Component, OnInit } from '@angular/core';
import { NavBarService } from '../nav-bar.service'
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { User } from '../user.model'




@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  
  constructor() {
  }

  ngOnInit(): void {
    
  }

}
