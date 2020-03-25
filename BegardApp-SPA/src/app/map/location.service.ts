import { Location } from './location.model';
import { EventEmitter } from '@angular/core';

export class LocationService{
    locationSelected = new EventEmitter<Location>();

    private locations:Location[] = [
        new Location('Iust','51.474896300','35.687463900',
        1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
        new Location('Iust2','51.474896300','35.687463900',
        1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
        new Location('Iust3','51.474896300','35.687463900',
        1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
        new Location('Iust4','51.474896300','35.687463900',
        1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
        new Location('Iust','51.474896300','35.687463900',
        1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg'),
        new Location('Iust','51.474896300','35.687463900',
        1,'Tehran','5','https://smapse.com/storage/2018/11/elmo-sanat-uni-8.jpg')
      ];

      getLocations(){
          return this.locations.slice();
      }
    
}