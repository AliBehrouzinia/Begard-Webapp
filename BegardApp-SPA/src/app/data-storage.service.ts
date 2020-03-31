import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { City } from './city.model';
import { UserService } from './user.service';
import { first, tap, take } from 'rxjs/operators';
import {  BehaviorSubject } from 'rxjs';

export interface AuthResponseData{
    key:string;
}


@Injectable()

export class DataStorageService{
    user =new BehaviorSubject<User>(null);
    

    constructor(private http : HttpClient,private userService:UserService ,
        ){}

    register(userData : { email : string , password1: string, password2:string}){

        return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/registration/',
        userData)
        .pipe(tap(resData =>{
            const user = new User(userData.email,resData.key);
            this.user.next(user);
        }));

    }

    userLogin(userData: { email : string , password :string}){

        return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/login/',userData)
        .pipe(tap(resData => {
            const user = new User(userData.email,resData.key);
            this.user.next(user);
        }));
         
    }

    getCities(){
        this.user.pipe(take(1)).subscribe(user =>{
            
        })

       return this.http.get<City[]>('http://127.0.0.1:8000/cities/');
    }


}