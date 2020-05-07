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
    console.log("planDetail : " + JSON.stringify(planDetail));
    this.postPlan.setDescription(planDetail.description + "");
    this.postPlan.setImage(planDetail.photo + "");
    console.log("posting data : " + JSON.stringify(this.postPlan))
    this.sendPostPlan();
  }

  private sendPostPlan() {
    const url = 'http://127.0.0.1:8000/plans/';

    this.authservice.user.subscribe(user => {
      var token = 'token ' + user.token;
      this.http
        .post<PostPlan>(url, JSON.stringify(this.postPlan), {
          headers: new HttpHeaders({
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }).toPromise().then()
    })

  }

}
