import { Component, OnInit } from '@angular/core';
import { LocationPostService } from './location-post.service';

@Component({
  selector: 'app-location-post',
  templateUrl: './location-post.component.html',
  styleUrls: ['./location-post.component.css']
})
export class LocationPostComponent implements OnInit {
  public userName: string ;
  public locationName: string;
  public cityName: string;
  public description: string;
  public imgsrc: string;
  public isLiked: boolean = false;
  centered = false;
  disabled = false;
  unbounded = false;
  public likedNum: number = 20;

  radius: number;
  color: string;

  constructor(private postservice : LocationPostService) { }

  ngOnInit(): void {

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
