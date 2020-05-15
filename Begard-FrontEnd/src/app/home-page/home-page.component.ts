import { Component, OnInit, HostListener } from '@angular/core';
import { NavBarService } from '../nav-bar.service'
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { User } from '../user.model'
import { PlanOverviewService } from '../plan-overview.service';
import { TopPlannersService } from '../top-planners.service';
import { PlanOverView } from '../plan-overview';
import { TopPlanner } from '../top-planner';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { element } from 'protractor';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  planOverviews;
  topPlanners: TopPlanner[];
  currentUrl: any;
  userPro: string;
  loginStatus$: Observable<boolean>;

  constructor(public planOverviewService: PlanOverviewService, public TopPlannersService: TopPlannersService,
    private router: ActivatedRoute,
    private user: UserService,
    private authService : AuthService) {
  }

  ngOnInit() {
    this.user.getUserId().subscribe(res => {
      this.userPro = '/profile/' + res.pk;
    });
    this.planOverviews = this.planOverviewService.getPlanOverviews()
    this.TopPlannersService.getTopPlanners().subscribe(tp => { this.topPlanners = tp; })
    this.currentUrl=this.router.url;
    this.loginStatus$ = this.authService.isLogedIn;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {




    if (window.pageYOffset > 335) {
      let element1 = document.getElementById('leftbar');
      element1.classList.add('sticky');
      let element2 = document.getElementById('rightbar');
      element2.classList.add('sticky');
      let element3 = document.getElementById('content');
      element3.classList.add('sticky');
      if (window.pageYOffset > 800) {
        
        let element = document.getElementById('');
        element.classList.add('sticky');
      }
      else {
        let element = document.getElementById('');
        element.classList.remove('sticky');

      }
    } else {
      let element1 = document.getElementById('leftbar');
      element1.classList.remove('sticky');

      let element2 = document.getElementById('rightbar');
      element2.classList.remove('sticky');

      let element3 = document.getElementById('content');
      element3.classList.remove('sticky');
    }
  }



}
