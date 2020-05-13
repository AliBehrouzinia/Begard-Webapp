import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { PostLocation } from './post-location'

@Injectable({
  providedIn: 'root'
})
export class PostLocationService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  sendPostLocation(postLocation) {
    console.log(JSON.stringify(postLocation));
    
    const url = 'http://127.0.0.1:8000/location-post/';

    this.authservice.user.subscribe(user => {
      var token = 'token ' + user.token;
      this.http
        .post<PostLocation>(url, JSON.stringify(postLocation), {
          headers: new HttpHeaders({
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }).toPromise().then()
    })

  }
}
