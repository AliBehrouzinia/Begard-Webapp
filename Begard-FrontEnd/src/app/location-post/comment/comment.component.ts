import { Component, OnInit, Input, OnChanges } from '@angular/core';
interface Comment{
  description:string
}


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit , OnChanges {

  constructor() { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if(changes['postId']){
      this.post=this.postId;
    }
  }

  
    
  @Input() postId: number;
  public post:number;

  ngOnInit(): void {


  }
  public comments:Comment[]=[
    {description: "dfkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"},
    {description:"dfjdkfjldfj;lsjdflsdjfldsjfldjflasjdfl;sjdf;ldjfs;ldjsf;lsjdflsdjf"}
  ];

}
