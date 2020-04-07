import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from './city.model';
import { first, tap, take } from 'rxjs/operators'



@Injectable()

export class DataStorageService {

    constructor(private http: HttpClient) { }

    getCities() {
        return this.http.get<City[]>('http://127.0.0.1:8000/cities/');
    }


}
