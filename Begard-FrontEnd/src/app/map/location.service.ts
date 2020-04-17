import { Location } from './location.model';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlanItem } from '../data-storage.service';
import { MapMarker } from './mapmarker.model';

@Injectable()

export class LocationService {

    constructor(private httpClinet: HttpClient) {

    }

    cityId: number = 1;
    locationSelected = new EventEmitter<Location>();

    public locations: MapMarker[];

    getLocations() {
        console.log(this.locations);
        return this.locations.slice();
    }

    getLocation(id: number) {
        return this.locations.slice()[id];
    }

    setId(id: number) {
        this.cityId = id;
    }

    setLocation(planitems: PlanItem[]) {
        this.locations=[];
        for (var i = 0; i < planitems.length; i++) {
            this.locations.push(new MapMarker(planitems[i].place_info.lng, planitems[i].place_info.lat));
        }

    }


}
    