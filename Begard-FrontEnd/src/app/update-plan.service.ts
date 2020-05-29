import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, exhaustMap, map } from 'rxjs/operators'
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MyPlan } from './my-plan'

@Injectable({
  providedIn: 'root'
})
export class UpdatePlanService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  updatePlan(planId, plan): Observable<string> {
    const url = 'http://127.0.0.1:8000/plans/' + planId + "/";

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .patch<string>(url, JSON.stringify(plan), {
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
