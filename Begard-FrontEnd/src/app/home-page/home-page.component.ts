import { Component, OnInit } from '@angular/core';
import { NavBarService } from '../nav-bar.service'
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../auth.service'
import { User } from '../user.model'
import { PlanOverviewService } from '../plan-overview.service';
import { PlanOverView } from '../plan-overview';





@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  planOverviews;
  plans
  
  constructor(public planOverviewService: PlanOverviewService) {
  }

  ngOnInit(): void {
    this.planOverviewService.getPlanOverviews().subscribe(planOverviews => {this.planOverviews = planOverviews});
  }
  
}
