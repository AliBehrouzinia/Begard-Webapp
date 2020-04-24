import { Component, OnInit } from '@angular/core';
interface Comment{
  description:string
}


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public comments:Comment[]=[
    {description: "dfkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"},
    {description:"dfjdkfjldfj;lsjdflsdjfldsjfldjflasjdfl;sjdf;ldjfs;ldjsf;lsjdflsdjf"}
  ];

}
