import { Component, OnInit } from '@angular/core';
import { DynamicSearchService } from '../dynamic-search.service';
import { Observable, observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  startWith,
  map,
  tap,
  debounceTime,
  mergeMapTo,
  mergeMap,
  switchMap,
  catchError
} from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-search',
  templateUrl: './dynamic-search.component.html',
  styleUrls: ['./dynamic-search.component.css']
})
export class DynamicSearchComponent implements OnInit {
  public locationsAutoComplete$: Observable<Location> = null;
  public autoCompleteControl = new FormControl();

  constructor(private dynamicSearchService: DynamicSearchService) { }

  lookup(value: string): Observable<Location> {
    return this.dynamicSearchService.search(value.toLowerCase()).pipe(
      // map the item property of the github results as our return object
      map(results => results),
      // catch errors
      tap(results => console.log("this is " + results))
      ,
      catchError(_ => {
        return of(null);
      })
    );
  }

  ngOnInit() {
    this.locationsAutoComplete$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is pressent, return null
          return of(null);
        }
      })
    );
  }

}
