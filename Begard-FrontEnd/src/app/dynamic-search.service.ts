import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './location';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicSearchService {

  TOKEN = 'token 4bb36e54a6b609331ece4205ae436027f92652f3';

  constructor(private http: HttpClient, private authservice: AuthService
  ) { }

  search(query: string, cityId: number): Observable<Location> {
    const url = 'http://127.0.0.1:8000/cities/' + cityId + '/search/simple/';

    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      var token = 'token ' + user.token;
      return this.http
        .get<Location>(url, {
          observe: 'response',
          params: {
            query: query,
            sort: 'stars',
            order: 'desc'
          },
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
