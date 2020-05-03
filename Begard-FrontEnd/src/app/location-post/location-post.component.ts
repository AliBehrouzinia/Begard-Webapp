import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationPostService, PostRes } from './location-post.service';
import { ThemePalette } from '@angular/material/core';
import { CommentComponent, Comment } from './comment/comment.component';

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
    public likeNums: number,
    public isLiked: boolean,
    public id: number

  ) { }
}

@Component({
  selector: 'app-location-post',
  templateUrl: './location-post.component.html',
  styleUrls: ['./location-post.component.css']
})
export class LocationPostComponent implements OnInit {

  @ViewChild(CommentComponent) child: CommentComponent;
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
  onLike(post: Post) {

    this.postservice.onLike(post.id).subscribe(resdata => {
      post.isLiked = true;
      post.likeNums++;
    });


  }
  onDislike(post: Post) {

    this.postservice.disLike(post.id).subscribe(resdata => {
      post.isLiked = false;
      post.likeNums--;
    });
  }

  onComment(post: Post, comment: string) {
    if (comment != '') {
      this.postservice.onComment(comment, post.id).subscribe(resdata => {
        var data: Comment = {
          id: 1,
          content: 'fuck you',
          user: 4,
          post: 5,
          user_name: 'Ali',
          user_profile_img: 'hot'
        }
        this.child.updateComment(data);
      });
      
    }

  }

}
