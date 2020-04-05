import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    error : string =null;

  constructor(private router : Router,private authService: AuthService ) { }

  ngOnInit(): void {
  }

  onLogin(loginData: NgForm){

    this.authService.login(loginData.value)
    .subscribe(
      resData=> {
      // this.router.navigate(["/search"])
      console.log(resData);
    },
      errorMessage => {
        console.log(errorMessage);
        this.error=errorMessage;
      }
    );

  

  }

}
