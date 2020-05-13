import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { PostLocation } from './post-location'

export interface FollowRequest{
  request_to
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  private sendFollowRequest(followRequest) {
    const url = 'http://127.0.0.1:8000/followings/requests/';

    this.authservice.user.subscribe(user => {
      var token = 'token ' + user.token;
      this.http
        .post<FollowRequest>(url, JSON.stringify(followRequest), {
          headers: new HttpHeaders({
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }).toPromise().then()
    })

  }}
