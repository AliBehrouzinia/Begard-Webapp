import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostLocationService {

  constructor(private http: HttpClient, private authservice: AuthService) { }

  sendPostLocation(postLocation): Observable<string> {
    const url = 'http://127.0.0.1:8000/location-post/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .post<string>(url, JSON.stringify(postLocation), {
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
}
