import {Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ProfileHeader {
    username: string,
    profile_image: string,
    posts_count: number,
    followings_count: number,
    followers_count: number,
    following_state: string
  }

@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(private authService : AuthService,
        private http : HttpClient){

    }
    getHeaderData(id : number){
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            var url = 'http://127.0.0.1:8000/profile/' + id + '/header/';
            return this.http.get<ProfileHeader>(url,
              {
                headers: new HttpHeaders({ 'Authorization': token })
              }
            );
          }));
    }
    
}