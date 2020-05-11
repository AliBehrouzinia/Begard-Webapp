import { Component, OnInit, ViewChild, ViewChildren, QueryList,Input } from '@angular/core';
import { LocationPostService, PostRes } from './location-post.service';
import { ThemePalette } from '@angular/material/core';
import { CommentComponent, Comment } from './comment/comment.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  @Input() currentUrl ;
  commentFc = new FormControl()

  @ViewChildren(CommentComponent) child: QueryList<CommentComponent>;

  public userName: string;
  

  public defaultValue : string = '';

  public posts: Post[] = [];
  centered = false;
  disabled = false;
  unbounded = false;

  radius: number;
  color: ThemePalette = "primary";

  constructor(private postservice: LocationPostService,
    private router: Router) { 
     
     
    }

  ngOnInit(): void {
    if(this.router.url==='/homepage'){
      this.postservice.getPostData().subscribe(resdata => {
        this.setPostData(resdata);
      });
    }
    else {
      this.postservice.getProfilePostData(this.currentUrl).subscribe(resdata => {
        this.setPostData(resdata);
      })
    }
    // console.log(this.router.url);
    
    

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

  onComment(post: Post) {
    if (this.commentFc.value != '') {
      for (var i = 0; i < this.child.toArray().length; i++) {
        if (this.child.toArray()[i].postId == post.id) {
          var commentChild= this.child.toArray()[i];
          this.postservice.onComment(this.commentFc.value, post.id).subscribe(resdata => {
            commentChild.updateComment(resdata);
            this.commentFc.reset();
            
          });
         
        }
      }
    

     

    }
  

  }

}
