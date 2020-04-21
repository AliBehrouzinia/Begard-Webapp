import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from './animation'

import 'hammerjs';


@Component({
  selector: 'app-horizontl-list',
  templateUrl: './horizontl-list.component.html',
  styleUrls: ['./horizontl-list.component.css']
})
export class HorizontlListComponent implements OnInit {
  @Input() name: string;

  imgags = [
    'assets/begrd_icon.svg',
  ];
  public carouselTileItems$: Observable<number[]>;
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
    this.tempData = [];
    this.carouselTileItems$ = interval(0).pipe(
      startWith(-1),
      take(30),
      map(val => {
        const data = (this.tempData = [
          ...this.tempData,
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        ]);
        return data;
      })
    );
  }

}
