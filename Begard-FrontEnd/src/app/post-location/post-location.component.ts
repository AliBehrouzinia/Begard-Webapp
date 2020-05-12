import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostLocationService } from '../post-location.service';
import { PostLocation, Image } from './../post-location'



@Component({
  selector: 'app-post-location',
  templateUrl: './post-location.component.html',
  styleUrls: ['./post-location.component.css']
})
export class PostLocationComponent implements OnInit {
  images = []
  imageStrings: Image[] = []
  imagePath;
  message;
  imgURL;

  postDisabled = true;
  plans = [1, 2, 3]
  locations = [1, 2, 4]

  public planControl: FormControl = new FormControl('');
  public locationControl: FormControl = new FormControl('');
  public descControl: FormControl = new FormControl('');


  constructor(private postLocationService: PostLocationService) { }

  ngOnInit(): void {
  }

  _handleReaderLoaded(readerEvt) {
    console.log("a : "+this.imageStrings.length)
    this.imageStrings.push({ image: readerEvt.target.result });
    console.log("b : "+this.imageStrings.length)
    this.updateSaveButtonDisabled();
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
      binaryReader.onload = this._handleReaderLoaded.bind(this);
      binaryReader.readAsDataURL(file);
    }
  }

  clearPhoto(i) {
    this.images.splice(i, 1);
  }

  post() {
    console.log("plan : " + this.planControl.value + "loc : " + this.locationControl.value + " desc : " + this.descControl.value)
    this.postLocationService.sendPostLocation(new PostLocation(
      'location_post',
      this.descControl.value,
      '1',
      this.locationControl.value,
      this.imageStrings
    ))
  }

  updateSaveButtonDisabled() {
    if (this.descControl.value != undefined) {
      if (this.descControl.value.length > 0 && this.imageStrings.length > 0) {
        this.postDisabled = false;
      }
      else {
        this.postDisabled = true;
      }
    }
    else {
      this.postDisabled = true;
    }
  }

  onChange(e) {
    this.updateSaveButtonDisabled;

  }
}
