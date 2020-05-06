import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-plan-overview',
  templateUrl: './plan-overview.component.html',
  styleUrls: ['./plan-overview.component.css']
})
export class PlanOverviewComponent implements OnInit {
  SERVER_URL = 'http://127.0.0.1:8000';
  @Input() plannerUsername;
  @Input() planCity;
  @Input() planCover;
  @Input() planDateCreted;
  @Input() plannerProfileCover;

  constructor() { }

  ngOnInit(): void {
    this.planCover = this.SERVER_URL + this.planCover;
    this.plannerProfileCover = this.SERVER_URL + this.plannerProfileCover;
    this.setDateCreation();
    this.setUserName();
  }

  setDateCreation() {
    let date = new Date(this.planDateCreted);
    let day = date.getUTCDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let currentDate = new Date();
    let dayDiff = ((currentDate.getFullYear() - year) * 365 + (currentDate.getMonth() - month) * 30 + (currentDate.getUTCDate() - day))
    if (dayDiff >= 2 && dayDiff < 7) {
      this.planDateCreted = "last week";
    } else if (dayDiff == 1) {
      this.planDateCreted = "Yesterday";
    } else if (dayDiff == 0) {
      this.planDateCreted = "Today";
    } else {
      this.planDateCreted = day + "/" + month + "/" + year;
    }
  }

  setUserName() {
    this.plannerUsername = this.plannerUsername.substring(0, this.plannerUsername.search('@'));
  }
}
