import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostPlan } from './post-plan';
import { AuthService } from './auth.service';
import { PlanDetail } from './post-dialog/post-dialog.component'
import { Observable } from 'rxjs';
import { map, take, exhaustMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PostPlanService {

  constructor(private http: HttpClient, private authservice: AuthService) { }
  postPlan;

  setPostPlan(postPlan: PostPlan) {
    this.postPlan = postPlan;
  }

  setPostPlanDetail(planDetail: PlanDetail) {
    this.postPlan.setDescription(planDetail.description + "");
    this.postPlan.setImage(planDetail.photo + "");
    return this.sendPostPlan();
  }

  sendPostPlan(): Observable<string> {
    const url = 'http://127.0.0.1:8000/plans/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .post<string>(url, JSON.stringify(this.postPlan), {
          observe: 'response',
          headers: new HttpHeaders({
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }).pipe(
          map(res => res.status.toString()))
    }))
  }

}
