import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.css']
})
export class MyPlanComponent implements OnInit {
  tiles: Tile[] = [
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
  ];
  constructor() {}

  ngOnInit(): void {
  }

}

