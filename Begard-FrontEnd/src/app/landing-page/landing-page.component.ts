import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  public baseUrl;

  constructor() { }

  ngOnInit(): void {
    this.baseUrl = environment.baseUrl;
  }

  scrollTo($element1, $element2) {

    var y = $element1.offsetTop - $element2.offsetHeight;
    window.scrollTo({
      top: y,
      left: 0,
      behavior: 'smooth'
    });


  }
}
