import { Component, OnInit } from '@angular/core';

import { Location } from '../location.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {
location: Location;
id: number;

  constructor(private route : ActivatedRoute
    ,private locationService: LocationService) { }

  ngOnInit(){
    this.route.params.subscribe(
      (params:Params)=>{
        this.id = +params['id'];
        this.location =this.locationService.getLocation(this.id);
      }
    );
  }

}
