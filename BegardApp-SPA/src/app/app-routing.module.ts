import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { LocationDetailComponent } from './map/location-detail/location-detail.component';
import { LocationDetailStartComponent } from './map/location-detail-start/location-detail-start.component';
import { DataStorageService} from './data-storage.service';

const appRoutes: Routes = [
    { path: '', redirectTo:'/login',pathMatch:'full'},
    {path : 'login' , component : LoginComponent},
    {path : 'register', component : RegisterComponent},
    {path : 'map' , component : MapComponent ,children:[
        {path : '' , component : LocationDetailStartComponent  },
        {path : ':id', component :LocationDetailComponent }  
    ]},
    { path: 'search' , component : SearchComponent}
]
@NgModule({
    imports:[RouterModule.forRoot(appRoutes) ],
    exports : [RouterModule]

})
export class AppRoutingModule{  

}