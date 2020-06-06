import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take, exhaustMap } from 'rxjs/operators';
import { type } from 'os';
import { environment } from 'src/environments/environment';

export interface FollowRequest {
  request_to
}

export interface FollowResult {
  status
}

export interface ResFollowReq {
  status: string;
}

export interface Follower {
  id;
  created;
  user_id;
  following_user_id;
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public userFollowing$ = new BehaviorSubject<boolean>(null);
  updateFollow = new EventEmitter<any[]>();
  constructor(private http: HttpClient, private authservice: AuthService) { }

  sendFollowRequest(followRequest): Observable<FollowResult> {
    const url = environment.baseUrl + '/followings/requests/';

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

  removeRequest(userId): Observable<string> {
    const url = environment.baseUrl + '/followings/requests/' + userId + "/";

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .delete<string>(url, {
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

  unfollow(userId): Observable<string> {
    const url = environment.baseUrl + '/followings/' + userId + "/";

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .delete<string>(url, {
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

  getFollowers() : Observable<Follower[]>{
    const url = environment.baseUrl + '/followers/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<Follower[]>(url, {
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

  getFollowings() : Observable<Follower[]>{
    const url = environment.baseUrl + '/followings/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<Follower[]>(url, {
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

  addFollowing() {
    this.userFollowing$.next(true)
  }

  removeFollowing() {
    this.userFollowing$.next(false)
  }
}