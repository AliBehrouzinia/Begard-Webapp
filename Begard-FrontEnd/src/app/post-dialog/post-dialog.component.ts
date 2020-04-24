import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PostPlanService } from '../post-plan.service';

export interface PlanDetail {
  description: string;
  photo: string;
}


@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent implements OnInit {
  @Output() onPostDetails: EventEmitter<any> = new EventEmitter<any>();
  description: string;
  coverBinaryString;
  public imagePath;
  imgURL: any;
  public message: string;


  constructor(
    public dialogRef: MatDialogRef<PostDialogComponent>,
    public postPlanService: PostPlanService
    ) { }


  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onPost() {
    console.log("this is description: " + this.description);
    console.log("this is photo: " + this.coverBinaryString);
    this.postPlanService.setPostPlanDetail({ description: this.description, photo: this.coverBinaryString })
    this.dialogRef.close();
  }

  _handleReaderLoaded(readerEvt) {
    this.coverBinaryString = readerEvt.target.result;
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

    var file = files[0];

    if (files && file) {
      var binaryReader = new FileReader();
      binaryReader.onload = this._handleReaderLoaded.bind(this);
      binaryReader.readAsBinaryString(file);
    }
  }
}
