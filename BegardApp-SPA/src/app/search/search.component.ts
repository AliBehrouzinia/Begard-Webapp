import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { City } from '../city.model';
import { LocationService } from '../map/location.service';
import { Router } from '@angular/router';
import { DataStorageService } from '../data-storage.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  public startdate:FormControl = new FormControl();
  public enddate:FormControl = new FormControl();



  /** list of cities */
  protected cities: City[] =[];


  /** control for the selected city */
  public cityCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public cityFilterCtrl: FormControl = new FormControl();

  /** list of cities filtered by search keyword */
  public filteredCities: ReplaySubject<City[]> = new ReplaySubject<City[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor(private locationService:LocationService,
    private router: Router,
    private dataStorageService :DataStorageService) { }

  ngOnInit() {
    this.getCities();
    // set initial selection
    this.cityCtrl.setValue(this.cities[0]);

    // load the initial city list
    this.filteredCities.next(this.cities.slice());

    // listen for search field value changes
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCities();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredCities are loaded initially
   */
  protected setInitialValue() {
    this.filteredCities
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredCities are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: City, b: City) => a && b && a.id === b.id;
      });
  }

  protected filterCities() {
    if (!this.cities) {
      return;
    }
    // get the search keyword
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCities.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cities
    this.filteredCities.next(
      this.cities.filter(city => city.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onSearch(){
    console.log(this.startdate.value);
    this.locationService.setId(this.cityCtrl.value?.id);
    this.locationService.setLocation();
    var path = '/calender/'/*+this.cityCtrl.value?.id*/;
    this.router.navigate([path]);
  }

    private getCities(){
        const promise = new Promise((resolve,reject) =>{
          this.dataStorageService.getCities()
          .toPromise()
          .then((cities:City[]) => {
            this.cities =cities;
            resolve();
          },
            err => {
              reject(err);
            }
          );
        });
        return promise;
      }


}
