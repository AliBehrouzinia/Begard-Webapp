import {Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { City } from './city.model';
import { first, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from './auth.service';



@Injectable()

export class DataStorageService{



    constructor(private http : HttpClient ,
        private authservice :AuthService
        ){}

    getCities(){

        return this.authservice.user.pipe(take(1),exhaustMap(user => {
            // console.log(user.token);
            return this.http.get<City[]>('http://127.0.0.1:8000/cities/',
            // {
            //     headers: new HttpHeaders({ 'format' : user.token })
            // }
            );
        }));

    }


}
