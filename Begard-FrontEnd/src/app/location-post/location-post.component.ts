import { Component, OnInit } from '@angular/core';
import { LocationPostService, PostRes } from './location-post.service';

class Post{
  constructor(
    public type : string,
    public description: string,
    public imgSrc : string,
    public placeName:string,
    public city : string,
    public userName : string,
    public userProImgSrc : string,
    public followingState : string,
    
  ){}
}

@Component({
  selector: 'app-location-post',
  templateUrl: './location-post.component.html',
  styleUrls: ['./location-post.component.css']
})
export class LocationPostComponent implements OnInit {

  public posts : Post[]= [];
  public isLiked: boolean = false;
  centered = false;
  disabled = false;
  unbounded = false;
  public likedNum: number = 20;

  radius: number;
  color: string;

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
        resdata[i].following_state));
      
    }

  }
  onLike() {
    this.isLiked = true;
    this.likedNum++;
  }
  onDislike() {
    this.isLiked = false;
    this.likedNum--;
  }
  onimage() {
    console.log('hello');
  }
}
