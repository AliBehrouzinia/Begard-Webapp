import { Injectable } from '@angular/core';
import { PlanOverView } from './plan-overview';
import { exhaustMap, take, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostPlan } from './post-plan';
import { AuthService } from './auth.service';
import { PlanDetail } from './post-dialog/post-dialog.component'

@Injectable({
  providedIn: 'root'
})
export class PlanOverviewService {
  private planOverviews$: BehaviorSubject<PlanOverView[]>;
  private tempData;

  // pos = [
  //   new PlanOverView("Today", 1, "London", "Ali Shoqi", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
  //   new PlanOverView("Yesterdy", 1, "Manchester", "Omid Moazzami", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
  //   new PlanOverView("Last week", 1, "Milan", "Hojjat Imani", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
  //   new PlanOverView("last month", 1, "Yasooj", "Arash Zareh", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
  //   new PlanOverView("last year", 1, "Eslam Abad", "Qolam Qolami", '../../assets/prr.png', "https://material.angular.io/assets/img/examples/shiba2.jpg"),
  // ]

  constructor(private http: HttpClient, private authservice: AuthService) { this.injectPlanOverviews(); }



  private injectPlanOverviews() {
    // this.tempData = [];
    // for (let i = 0; i < 20; i++) {
    //   this.tempData[i] = this.pos[Math.floor(Math.random() * this.pos.length)]
    // }
    // this.planOverviews$ = new BehaviorSubject<PlanOverView[]>(this.tempData);
  }

  getPlanOverviews() {
    const url = 'http://127.0.0.1:8000/top-posts/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<PlanOverView[]>(url, {
          observe: 'response',
          params: {
            page: '1',
          }
        })
        .pipe(
          map(res => {
            console.log("fuckin : " + res.body)
            return res.body;
          })
        );
    }));
  }
}
