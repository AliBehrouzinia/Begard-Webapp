import { Component, OnInit, Input } from '@angular/core';

import { Location } from '../../location.model';
import { LocationService } from '../../location.service';

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrls: ['./location-item.component.css']
})
export class LocationItemComponent implements OnInit {
  @Input() location:Location;

  constructor(private locationService : LocationService) { }

  ngOnInit(): void {
  }

  onSeleceted(){
    this.locationService.locationSelected.emit(this.location);
  }

}
