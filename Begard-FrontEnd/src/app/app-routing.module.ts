import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { LocationDetailComponent } from './map/location-detail/location-detail.component';
import { LocationDetailStartComponent } from './map/location-detail-start/location-detail-start.component';
import { DataStorageService } from './data-storage.service';
import { CalenderComponent } from './calender/calender.component';
import { CalenderResolver } from './calender-resolver.service';
import { HomePageComponent } from './home-page/home-page.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/homepage', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'homepage', component: HomePageComponent },
    {
        path: 'map', component: MapComponent, children: [
            { path: '', component: LocationDetailStartComponent },
            { path: ':id', component: LocationDetailComponent }
        ]
    },
    { path: 'search', component: SearchComponent },
    { path: 'calender/:city', component: CalenderComponent, resolve: { plan: CalenderResolver } }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})
export class AppRoutingModule {

}