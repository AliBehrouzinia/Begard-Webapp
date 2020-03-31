import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { User } from '../user.model';
import { DataStorageService } from '../data-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new Subject<User>();

  constructor(private dataStorageService :DataStorageService, private router : Router) { }

  ngOnInit(): void {
  }
  onCreateUser(registerData ){
    this.dataStorageService.register(registerData.value)
    .subscribe(dataResponse => {
      this.router.navigate(["/search"])
    });
  }

}
