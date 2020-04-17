import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { City } from './city.model';
import { first, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export interface PlanItem {
    start_date: string,
    finish_date: string,
    place_name: string,
    place_info: { id: string, lat: string, lng: string }

}


export interface Plan {
    plan: {
        start_date: string,
        finish_date: string,
        plan_items: PlanItem[]
    }


}

@Injectable()

export class DataStorageService {
    public planUrl: string = '';

    constructor(
        private http: HttpClient,
        private authservice: AuthService
    ) { }


    getplan(): Observable<Plan> {
        return this.authservice.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            return this.http.get<Plan>(this.planUrl,
                {
                    headers: new HttpHeaders({ 'Authorization': token })
                }
            );
        }));

    }

    getCities() {

        return this.authservice.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            return this.http.get<City[]>('http://127.0.0.1:8000/cities/',
                {
                    headers: new HttpHeaders({ 'Authorization': token })
                }
            );
        }));

    }


}
