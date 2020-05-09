import { Component, OnInit } from '@angular/core';
import { NavBarService } from '../nav-bar.service'
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { User } from '../user.model'
import { PlanOverviewService } from '../plan-overview.service';
import { TopPlannersService } from '../top-planners.service';
import { PlanOverView } from '../plan-overview';
import { TopPlanner } from '../top-planner';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  planOverviews;
  topPlanners: TopPlanner[];

  constructor(public planOverviewService: PlanOverviewService, public TopPlannersService: TopPlannersService) {
  }

  ngOnInit() {
    this.planOverviews = this.planOverviewService.getPlanOverviews()
    this.TopPlannersService.getTopPlanners().subscribe(tp => { this.topPlanners = tp; })
  }

}
