import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from './animation'

import 'hammerjs';
import { PlanOverView } from '../plan-overview';


@Component({
  selector: 'app-horizontl-list',
  templateUrl: './horizontl-list.component.html',
  styleUrls: ['./horizontl-list.component.css']
})
export class HorizontlListComponent implements OnInit {
  @Input() planOverviews: PlanOverView[];
  img =  "https://material.angular.io/assets/img/examples/shiba2.jpg";
  name = "john malcovich";
  date = "Today";
  city = "London";
  profileCover = '../../assets/prr.png';

  imgags = [
    'assets/begrd_icon.svg',
  ];
  public carouselTileConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 5, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 1500 },
    animation: 'lazy' 
  };
  tempData: any[];
  
  constructor() {}

  ngOnInit() {
    document.querySelector("body").style.cssText = "--profile-cover-url: url("+this.profileCover+")";
  }

}
