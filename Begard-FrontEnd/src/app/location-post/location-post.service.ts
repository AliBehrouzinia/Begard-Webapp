import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PostRes { 
    "id": number,
    "type": string,
    "creation_date": string,
    "content": string,
    "image": string,
    "place_id": string,
    "place_name": string,
    "rate": string,
    "user": number,
    "plan_id": number,
    "destination_city": string,
    "user_name": string,
    "user_profile_image": string,
    "following_state": string
}

@Injectable()
export class LocationPostService {
    constructor( private http : HttpClient) { }

    getPostData(){
       return this.http.get<PostRes[]>("127.0.0.1:8000/posts/?page=1");
    }
  
}
