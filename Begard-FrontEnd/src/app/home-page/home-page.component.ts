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
import { element, promise } from 'protractor';
import { environment } from '../../environments/environment';
import { FollowService } from '../follow.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  planOverviews;
  topPlanners: TopPlanner[] = [];
  allTopPlanners: TopPlanner[] = [];
  currentUrl: any;
  userPro: string;
  loginStatus$: Observable<boolean>;
  public baseurl;

  constructor(public planOverviewService: PlanOverviewService, public TopPlannersService: TopPlannersService,
    private router: ActivatedRoute,
    private user: UserService,
    private authService: AuthService,
    private followSerivce: FollowService,
    private snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.baseurl = environment.baseUrl;
    this.user.getUserId().subscribe(res => {
      this.userPro = '/profile/' + res.pk;
    });
    this.planOverviews = this.planOverviewService.getPlanOverviews()
    this.TopPlannersService.getTopPlanners().subscribe(tp => {
      this.allTopPlanners = tp;
      this.initTopPlanners(tp);
    })
    this.currentUrl = this.router.url;
    this.loginStatus$ = this.authService.isLogedIn;

    this.followSerivce.updateFollow.subscribe(res => {
      if (res[1] == "Following" || res[1] == "Requested") {
        this.replaceTopPlanner(res[0]);
        if (res[1] == "Following")
          this.openSnackBar("followed successfully")
        else {
          this.openSnackBar("requested successfully")
        }
      }
    })
  }

  initTopPlanners(tp: TopPlanner[]) {
    for (let i = 0; i < Math.min(tp.length, 6); i++) {
      this.topPlanners.push(this.allTopPlanners[0])
      this.allTopPlanners.splice(0, 1);
    }
  }

  replaceTopPlanner(id) {
    for (let i = 0; i < this.topPlanners.length; i++) {
      if (id == this.topPlanners[i].pk) {
        if (this.allTopPlanners.length > 0) {
          this.topPlanners.splice(i, 1, this.allTopPlanners[0])
          this.allTopPlanners.splice(0, 1)
        }
        else
          this.topPlanners.splice(i, 1)
      }
    }
  }

  openSnackBar(message) {
    this.snackbar.open(
      message, "", {
      duration: 3 * 1000
    }
    );
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

    } else {
      let element1 = document.getElementById('leftbar');
      element1.classList.remove('sticky');

      let element2 = document.getElementById('rightbar');
      element2.classList.remove('sticky');

      let element3 = document.getElementById('content');
      element3.classList.remove('sticky');
    }
  }

  refresh() {
    location.reload()
  }
}
