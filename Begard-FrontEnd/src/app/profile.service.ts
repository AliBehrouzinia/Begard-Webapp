import { Injectable } from '@angular/core';
import { PlanOverView } from './plan-overview';
import { exhaustMap, take, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostPlan } from './post-plan';
import { AuthService } from './auth.service';
import { Profile } from './profile'

@Injectable({
  providedIn: 'root'
})
export class PofileService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  getProfile(id) {
    var url = 'http://127.0.0.1:8000/profile/' + id + '/header/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<Profile[]>(url, {
          observe: 'response',
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
