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
   @Input() index : number;
  

  ngOnInit(): void {
  }

 

}
