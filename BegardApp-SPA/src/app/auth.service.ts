import { Injectable } from "@angular/core";
import { HttpClient,HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";


export interface AuthResponseData{
    key:string;
}


@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient){}

  signup(userData : { email : string , password1: string, password2:string}){
   return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/registration/',
   userData)
   .pipe(catchError(this.handleError));

  }

  login(userData){
    return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/login/',
    userData).
    pipe(catchError(this.handleError));

  }

  private handleError(errorRes : HttpErrorResponse){
    let errorMessage = 'An unknown error';

    // if(!errorRes.error || !errorRes.error.error){
    //   return throwError(errorMessage);
    // }
    // switch (errorRes.error.error.message) {
    //  case 'Email-exsits':
    //    errorMessage='this email already exists';
    //    break;
    //
    // }
    return throwError(errorMessage);

  }
}
