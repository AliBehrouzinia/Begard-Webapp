import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { User } from '../user.model';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new Subject<User>();

  constructor(private authService : AuthService , private router : Router) { }



  ngOnInit(): void {
  }
  onCreateUser(registerData : NgForm){
    if(!registerData.valid){
      return;
    }
    this.authService.signup(registerData.value)
    .subscribe(
      resData=> {
      // this.router.navigate(["/search"])
      console.log(resData);
      },
      error => {
        console.log(error);
      }
    );
    // console.log(registerData.value);
    // this.dataStorageService.register(registerData.value)

    registerData.reset();
  }


}
