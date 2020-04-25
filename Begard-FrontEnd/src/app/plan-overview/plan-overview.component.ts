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

  constructor() { }

  ngOnInit(): void {
    this.setDateCreation();
  }

  setDateCreation() {
    // this.date = new Date();
    // if (this.planDateCreted == this.date){
    //   this.planDateCreted = "Today";
    // }else if(this.planDateCreted.getCurrentDay()+1 == this.date){
    //   this.planDateCreted = "Yesterday";
    // }
  }

}
