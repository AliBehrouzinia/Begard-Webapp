import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TopPlanner } from './top-planner';


@Injectable({
  providedIn: 'root'
})
export class TopPlannersService {

  constructor(private http: HttpClient) { }

  getTopPlanners() {
    const url = 'http://127.0.0.1:8000/top-planners/';

    return this.http
      .get<TopPlanner[]>(url, {
        observe: 'response',
        params: {
          page: '1',
        }
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
}

