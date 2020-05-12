import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, exhaustMap , map} from 'rxjs/operators'
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MyPlan } from './my-plan'


@Injectable({
  providedIn: 'root'
})
export class MyPlanService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  getMyPlans() {
    const url = 'http://127.0.0.1:8000/plans/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + '9501647d8fb5b2a108c2881364ac44f4300b42f9';
      return this.http
        .get<MyPlan[]>(url, {
          observe: 'response',
          headers: new HttpHeaders({ 'Authorization': token })
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
