import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-plan-overview',
  templateUrl: './plan-overview.component.html',
  styleUrls: ['./plan-overview.component.css']
})
export class PlanOverviewComponent implements OnInit {
  @Input() plannerUsername;
  @Input() planCity;
  @Input() planCover;
  @Input() planDateCreted;
  @Input() plannerProfileCover;
  date

  constructor() { }

  ngOnInit(): void {
    this.planCover = 'http://127.0.0.1:8000' + this.planCover;
    this.plannerProfileCover = 'http://127.0.0.1:8000' + this.plannerProfileCover;
    this.setDateCreation();
  }

  setDateCreation() {
    this.date = new Date(this.planDateCreted);
    console.log(" date : " + this.date);
       
  }
}
