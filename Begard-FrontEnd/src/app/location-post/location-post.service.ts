import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LocationPostService {
    constructor( private http : HttpClient) { }
  

    setUsername() {
         return this.http.get("https://begardapp.firebaseio.com/username.json");



    }
}
