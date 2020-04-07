import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Location } from './location';

@Injectable({
  providedIn: 'root'
})
export class DynamicSearchService {

  constructor(private http: HttpClient) { }

  search(query: string): Observable<Location> {
    const url = 'http://127.0.0.1:8000/location/1/?format=api';
    return this.http
      .get<Location>(url, {
        observe: 'response',
        params: {
          q: query,
          sort: 'stars',
          order: 'desc'
        }
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
}
