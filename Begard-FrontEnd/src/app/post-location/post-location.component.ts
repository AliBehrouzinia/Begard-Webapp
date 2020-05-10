import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-location',
  templateUrl: './post-location.component.html',
  styleUrls: ['./post-location.component.css']
})
export class PostLocationComponent implements OnInit {
  images = []
  imagePath;
  message;
  imgURL;
  constructor() { }

  ngOnInit(): void {
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
      this.images.push(this.imgURL);

    }

    var file = files[0];

    if (files && file) {
      var binaryReader = new FileReader();
      binaryReader.readAsDataURL(file);
    }
  }

    clearPhoto(i){
      console.log(i);
      this.images.splice(i,1);
    }
}
