import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, BehaviorSubject } from "rxjs";
import { User } from "./user.model";


export interface AuthResponseData {
  key: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  signup(userData: { email: string, password1: string, password2: string }) {
    return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/registration/',
      userData)
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(userData.email, resData.key);
      }
      ));
  }

  login(userData: { email: string, password: string }) {
    return this.http.post<AuthResponseData>('http://127.0.0.1:8000/rest-auth/login/',
      userData).
      pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(userData.email, resData.key);
      }
      ));

  }

  private handleAuthentication(email: string, token: string) {
    const user = new User(email, token);
    this.user.next(user);

  }

  private handleError(errorRes: HttpErrorResponse) {
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
