import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LocationListComponent } from './map/location-list/location-list.component';
import { LocationItemComponent } from './map/location-list/location-item/location-item.component';
import { LocationDetailComponent } from './map/location-detail/location-detail.component';
import { SearchComponent } from './search/search.component';

@NgModule({
   declarations: [
      AppComponent,
      MapComponent,
      HeaderComponent,
      LoginComponent,
      RegisterComponent,
      LocationListComponent,
      LocationItemComponent,
      LocationDetailComponent,
      SearchComponent
   ],
   imports: [
      BrowserModule,
      
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
