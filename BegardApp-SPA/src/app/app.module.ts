import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { UserService} from './user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


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
import { AppRoutingModule } from './app-routing.module';
import { LocationDetailStartComponent} from './map/location-detail-start/location-detail-start.component';
import { LocationService } from './map/location.service';
import { ScheduleModule, RecurrenceEditorModule,DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService,DragAndDropService,ResizeService } from '@syncfusion/ej2-angular-schedule';
import { CalenderComponent } from './calender/calender.component';

import { GridModule, RowDDService, EditService } from '@syncfusion/ej2-angular-grids';



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
      LocationDetailStartComponent,
      SearchComponent,
      CalenderComponent
      
   ],
   imports: [
      BrowserModule,
      FormsModule,
      BrowserAnimationsModule,
      AngularMaterialModule,  
      ReactiveFormsModule,
      HttpClientModule,
      AppRoutingModule,
    MatSelectModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    FlexLayoutModule,
    ScheduleModule, RecurrenceEditorModule,
    GridModule
      
   ],
   providers: [DataStorageService,UserService,LocationService,
      DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService,DragAndDropService,ResizeService,RowDDService, EditService],
   bootstrap: [
      AppComponent
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
