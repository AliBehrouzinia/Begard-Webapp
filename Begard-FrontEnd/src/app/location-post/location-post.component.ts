import { Component, OnInit } from '@angular/core';
import { LocationPostService, PostRes } from './location-post.service';
import { ThemePalette } from '@angular/material/core';

class Post {
  constructor(
    public type: string,
    public description: string,
    public imgSrc: string,
    public placeName: string,
    public city: string,
    public userName: string,
    public userProImgSrc: string,
    public followingState: string,
    public likeNums:number,
    public isLiked:boolean,
    public id:number

  ) { }
}

@Component({
  selector: 'app-location-post',
  templateUrl: './location-post.component.html',
  styleUrls: ['./location-post.component.css']
})
export class LocationPostComponent implements OnInit {
  public userName: string;

  public posts: Post[] = [];
  centered = false;
  disabled = false;
  unbounded = false;

  radius: number;
  color: ThemePalette = "primary";

  constructor(private postservice: LocationPostService) { }

  ngOnInit(): void {
    this.postservice.getPostData().subscribe(resdata => {
      this.setPostData(resdata);
      console.log(resdata);
    });

  }

  private setPostData(resdata: PostRes[]) {
    for (var i = 0; i < resdata.length; i++) {
      this.posts.push(new Post(resdata[i].type,
        resdata[i].content,
        resdata[i].image,
        resdata[i].place_name,
        resdata[i].destination_city,
        resdata[i].user_name,
        resdata[i].user_profile_image,
        resdata[i].following_state,
        resdata[i].number_of_likes,
        resdata[i].is_liked,
        resdata[i].id));

    }

  }
  onLike(post : Post) {
    post.isLiked= true;
    post.likeNums++;
    this.postservice.onLike(post.id);

    
  }
  onDislike(post : Post) {
    post.isLiked=false;
    post.likeNums--;
   this.postservice.disLike(post.id);
  }
  
}
