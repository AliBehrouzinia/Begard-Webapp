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

export interface PI {
    id;
    place_id;
    finish_date;
    start_date;
}

export interface MyPlan {
    id;
    destination_city;
    description;
    creation_date;
    start_date;
    finish_date;
    plan_items: PI[];
}

@Injectable()

export class DataStorageService {
    public planUrl: string = '';
    start_date;
    finish_date;
    city;

    constructor(
        private http: HttpClient,
        private authservice: AuthService
    ) { }


    getSuggestedPlan(): Observable<Plan> {
        return this.authservice.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            return this.http.get<Plan>(this.planUrl,
                {
                    headers: new HttpHeaders({ 'Authorization': token })
                }
            );
        }));
    }

    getPlan(planId): Observable<MyPlan> {
        let url = 'http://127.0.0.1:8000/plans/' + planId + "/"
        return this.authservice.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            return this.http.get<MyPlan>(this.planUrl,
                {
                    headers: new HttpHeaders({ 'Authorization': token })
                }
            );
        }));
    }

    getCities() {
        return this.http.get<City[]>('http://127.0.0.1:8000/cities/');
    }

    getPlanUrl() {
        return this.planUrl;
    }

    setStartDate(sd) {
        this.start_date = sd;
    }

    setEndDate(ed) {
        this.finish_date = ed;
    }

    setCity(c) {
        this.city = c;
    }

    getStartDate() {
        return this.start_date;
    }

    getEndDate() {
        return this.finish_date;
    }

    getCity() {
        return this.city;
    }

}
