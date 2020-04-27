import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { DataStorageService } from './data-storage.service';
import { CalenderComponent } from './calender/calender.component';
import { CalenderResolver } from './calender-resolver.service';
import { HomePageComponent } from './home-page/home-page.component';
import { LocationPostComponent } from './location-post/location-post.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/homepage', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'search', component: SearchComponent },
    { path: 'homepage', component: HomePageComponent },
    { path: 'calender/:city', component: CalenderComponent, resolve: { plan: CalenderResolver } },
    { path: 'postlocatio', component: LocationPostComponent },
  
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})
export class AppRoutingModule {

}