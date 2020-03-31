import { Location } from './location.model';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class LocationService{

    constructor(private httpClinet:HttpClient){

    }

    cityId : number =1;
    locationSelected = new EventEmitter<Location>();

    private locations:Location[] = []

      getLocations(){
          return this.locations.slice();
      }

      getLocation(id : number){
          return this.locations.slice()[id];
      }

      setId(id : number){
          this.cityId = id;
      }

      setLocation(){
        var url = "http://127.0.0.1:8000/location/"+this.cityId;
          this.httpClinet.get<Location[]>(url).subscribe(resdata =>{
              this.locations=resdata;
          })
          

      }
    
}