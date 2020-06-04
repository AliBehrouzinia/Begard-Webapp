import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FollowService } from '../follow.service';
import { environment } from 'src/environments/environment';

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
  constructor(private authService: AuthService,
    private http: HttpClient,
    private followService: FollowService) {

  }
  getHeaderData(id: number) {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      var url = environment.baseUrl + '/profile/' + id + '/header/';
      return this.http.get<ProfileHeader>(url
      );
    }));
  }

  onFollow(id: number) {
    var userid: number = (Number)(id);
    return this.followService.sendFollowRequest({ request_to: userid });
  }

}