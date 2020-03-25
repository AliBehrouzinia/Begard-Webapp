import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class DataStorageService{
    constructor(private http : HttpClient ){}

    getCities(){

        this.http.get('127.0.0.1:8000/cities/').subscribe(cities => {
            console.log(cities);
        });

    }

}