import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from '../data-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router : Router,private dataStorageService:DataStorageService) { }

  ngOnInit(): void {
  }

  onLogin(loginData: {email : string , password : string }){
    
    this.dataStorageService.userLogin(loginData)
    .subscribe(dataResponse => {
      this.router.navigate(["/search"]);
    });
    
  }

}
