import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './location';

@Injectable({
  providedIn: 'root'
})
export class DynamicSearchService {

  TOKEN = 'token 88ba25d2d8ad9065f8169f0908f6a9272fff39c1';

  constructor(private http: HttpClient) { }

  search(query: string, cityId: number): Observable<Location> {
    const url = 'http://127.0.0.1:8000/cities/' + cityId + '/search/simple/';
    return this.http
      .get<Location>(url, {
        observe: 'response',
        params: {
          query: query,
          sort: 'stars',
          order: 'desc'
        },
        headers: new HttpHeaders({ 'Authorization': this.TOKEN })
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
}
