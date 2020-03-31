import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, first} from 'rxjs/operators';
import { DataStorageService } from '../data-storage.service';
import { City } from '../city.model';
import { rejects } from 'assert';
import { promise } from 'protractor';
import { Router } from '@angular/router';
import { LocationService } from '../map/location.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  
  constructor(private route : Router,private dataStorageService :DataStorageService,
    private locationService : LocationService){}


  targetCity:string;
  
  myControl = new FormControl();
  cities : City[]=[] ;
  filteredCities: Observable<string[]>;
  options : string[] =[];

  ngOnInit() {
    this.getCities();
    this.filteredCities = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(city: string): string[] {
    const filtercityName = city.toLowerCase();

    return this.options.filter(city => city.toLowerCase().includes(filtercityName));
  }

  private getCities(){
    const promise = new Promise((resolve,reject) =>{
      this.dataStorageService.getCities()
      .toPromise()
      .then((cities:City[]) => {
        this.cities =cities;
        for(var i =0;i<this.cities.length;i++)
        {
          this.options[i]=this.cities[i].name;
        }
        resolve();
      },
        err => {
          reject(err);
        }
      ); 
    });
    return promise;
  }

  onSearch(target:{cityName : string,cityId:number}){
    this.locationService.setId(target.cityId);
    this.locationService.setLocation();
    this.route.navigate(['/map']);

  }

  // onUpdateCity(value : string){
  //   // this.targetCity=(<HTMLInputElement>event.target).value;
  //   this.targetCity=value;
  // }
}
