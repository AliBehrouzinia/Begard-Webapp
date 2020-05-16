import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-location-carousel',
  templateUrl: './location-carousel.component.html',
  styleUrls: ['./location-carousel.component.css']
})
export class LocationCarouselComponent implements OnInit {

  @Input() imgSrc : string[];

  imgUrl :string[] =[];

  constructor() { }

  ngOnInit(): void {
   for(var i =0 ;i< this.imgSrc.length;i++){
     this.imgUrl.push("http://127.0.0.1:8000"+ this.imgSrc[i]);
   }

  }

}
