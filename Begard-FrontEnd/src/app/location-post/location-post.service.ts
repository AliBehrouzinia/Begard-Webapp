import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { take, exhaustMap } from 'rxjs/operators';

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
    "number_of_likes": number,
    "is_liked": boolean,
    "following_state": string
}

@Injectable()
export class LocationPostService {
    constructor( private http : HttpClient,
        private authService : AuthService) { }

    getPostData(){
       return this.authService.user.pipe(take(1), exhaustMap(user => {
        var token = 'token ' + user.token;
        return this.http.get<PostRes[]>("http://127.0.0.1:8000/posts/?page=1",
            {
                headers: new HttpHeaders({ 'Authorization': token })
            }
        );
    }))
    }
    
    onLike(id : number){
        
         this.authService.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            var url = 'http://127.0.0.1:8000/posts/'+ id + '/likes/';
            return this.http.post(url,{},
                {
                    headers: new HttpHeaders({ 'Authorization': token })
                }
            );
        })).subscribe();
        

    }

    disLike(id : number){

        this.authService.user.pipe(take(1), exhaustMap(user => {
            var token = 'token ' + user.token;
            var url = 'http://127.0.0.1:8000/posts/'+ id + '/likes/';
            return this.http.delete(url,
                {
                    headers: new HttpHeaders({ 'Authorization': token })
                }
            );
        })).subscribe();


    }
  
}
