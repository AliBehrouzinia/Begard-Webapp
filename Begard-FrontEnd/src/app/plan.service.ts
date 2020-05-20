import { Injectable } from '@angular/core';
import { take, exhaustMap, map } from 'rxjs/operators'
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface PlanItem {
  id;
  place_id;
  start_date;
  finish_date;
}

export interface Plan {
  id;
  destination_city;
  creation_date;
  start_date;
  finish_date;
  plan_items: PlanItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  getPlan(planId) {
    const url = 'http://127.0.0.1:8000/plans/' + planId;

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<Plan[]>(url, {
          observe: 'response',
          headers: new HttpHeaders({ 'Authorization': token })
        })
        .pipe(
          map(res => {
            return res.body;
          })
        );
    }));
  }

}
