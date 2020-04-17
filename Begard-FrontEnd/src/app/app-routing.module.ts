import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { DataStorageService } from './data-storage.service';
import { CalenderComponent } from './calender/calender.component';
import { CalenderResolver } from './calender-resolver.service';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'map', component: MapComponent },
    { path: 'search', component: SearchComponent },
    { path: 'calender/:city', component: CalenderComponent, resolve: { plan: CalenderResolver } }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})
export class AppRoutingModule {

}