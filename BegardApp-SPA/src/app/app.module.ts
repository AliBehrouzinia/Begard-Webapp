import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { AngularMaterialModule } from './angular-material.module';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LocationListComponent } from './map/location-list/location-list.component';
import { LocationItemComponent } from './map/location-list/location-item/location-item.component';
import { LocationDetailComponent } from './map/location-detail/location-detail.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataStorageService } from './data-storage.service';



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
      FormsModule,
      BrowserAnimationsModule,
      AngularMaterialModule,  
      ReactiveFormsModule,
      HttpClientModule
   ],
   providers: [DataStorageService],
   bootstrap: [
      AppComponent
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
