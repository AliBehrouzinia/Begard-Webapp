import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { City } from './city.model';
import { UserService } from './user.service';
import { first, tap, take } from 'rxjs/operators';
import {  BehaviorSubject } from 'rxjs';



@Injectable()

export class DataStorageService{
    user =new BehaviorSubject<User>(null);


    constructor(private http : HttpClient,private userService:UserService ,
        ){}

    getCities(){
        this.user.pipe(take(1)).subscribe(user =>{

        })

       return this.http.get<City[]>('http://127.0.0.1:8000/cities/');
    }


}
