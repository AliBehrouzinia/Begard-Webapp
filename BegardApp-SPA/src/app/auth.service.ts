import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface AuthResponseData{
    key:string;
}


@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient){}

  signup(userData : { email : string , password1: string, password2:string}){
   return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/registration/',userData);

  }
}
