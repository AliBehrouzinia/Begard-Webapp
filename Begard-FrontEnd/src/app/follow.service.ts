import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take, exhaustMap } from 'rxjs/operators';

export interface FollowRequest {
  request_to
}

export interface FollowResult {
  status
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  sendFollowRequest(followRequest): Observable<FollowResult> {
    const url = 'http://127.0.0.1:8000/followings/requests/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .post<FollowResult>(url, JSON.stringify(followRequest), {
          observe: 'response',
          headers: new HttpHeaders({
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }).pipe(
          map(res => res.body))
    }))
  }
}