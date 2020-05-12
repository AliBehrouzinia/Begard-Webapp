import { Injectable } from '@angular/core';
import { take, exhaustMap, map } from 'rxjs/operators'
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MyLocation } from './my-location'


@Injectable({
  providedIn: 'root'
})
export class MyLocationService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  getMyLocations(planId) {
    const url = 'http://127.0.0.1:8000/plans/' + planId + '/locations/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<MyLocation[]>(url, {
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
