import { MapMarker } from './map/mapmarker.model';
import { PlanItem } from './data-storage.service';


export class MapLocationService {

    public locations: MapMarker[];

    setLocation(planitems: PlanItem[]) {
        this.locations = [];
        for (var i = 0; i < planitems.length; i++) {
            this.locations.push(new MapMarker(planitems[i].place_info.lng, planitems[i].place_info.lat));
        }
    }

    getLocations() {
        console.log(this.locations);
        return this.locations.slice();
    }
    
}