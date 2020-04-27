import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostPlan } from './post-plan';
import { AuthService } from './auth.service';
import { PlanDetail } from './post-dialog/post-dialog.component'


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
    console.log("service : " + planDetail);
    this.postPlan.setDescription(planDetail.description + "");
    console.log("postind data : " + this.postPlan)
    this.sendPostPlan();
  }

  private sendPostPlan() {
    const url = 'http://127.0.0.1:8000/plans/';

    this.authservice.user.subscribe(user => {
      var token = 'token ' + user.token;
      this.http
        .post<PostPlan>(url, this.postPlan, {
          headers: new HttpHeaders({ 'Authorization': token })
        }).toPromise().then()
    })

  }

}
