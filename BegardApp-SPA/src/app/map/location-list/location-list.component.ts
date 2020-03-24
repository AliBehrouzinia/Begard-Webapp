import { Component, OnInit } from '@angular/core';

import { Location } from '../location.model';



@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {
  locations:Location[] = [
    new Location('Iust','51.474896300','35.687463900',
    1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
    new Location('Iust','51.474896300','35.687463900',
    1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
    new Location('Iust','51.474896300','35.687463900',
    1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
    new Location('Iust','51.474896300','35.687463900',
    1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
    new Location('Iust','51.474896300','35.687463900',
    1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
    new Location('Iust','51.474896300','35.687463900',
    1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
