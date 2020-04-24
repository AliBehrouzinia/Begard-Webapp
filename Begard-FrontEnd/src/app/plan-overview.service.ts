import { Injectable } from '@angular/core';
import { PlanOverView } from './plan-overview';
import { startWith, take, map } from 'rxjs/operators';
import { Observable, interval ,BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlanOverviewService {
  private planOverviews$: BehaviorSubject<PlanOverView[]>;
  private tempData;

  pos = [
    new PlanOverView("Today", 1, "London", "Ali Shoqi", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
    new PlanOverView("Yesterdy", 1, "Manchester", "Omid Moazzami", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
    new PlanOverView("Last week", 1, "Milan", "Hojjat Imani", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
    new PlanOverView("last month", 1, "Yasooj", "Arash Zareh", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
    new PlanOverView("last year", 1, "Eslam Abad", "Qolam Qolami", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
  ]

  constructor() { this.injectPlanOverviews(); }

  private injectPlanOverviews() {
    this.tempData = [];
    for (let i = 0; i < 20; i++) {
      this.tempData[i] = this.pos[Math.floor(Math.random() * this.pos.length)]
    }
    this.planOverviews$ = new BehaviorSubject<PlanOverView[]>(this.tempData);
  }

  getPlanOverviews(){
    return this.planOverviews$;
  }
}
