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
  pv
  constructor() {}

  ngOnInit() {
    this.pv = [1,3,4]
  }

}
