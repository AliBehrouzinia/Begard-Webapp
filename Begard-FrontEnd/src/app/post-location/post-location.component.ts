import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostLocationService } from '../post-location.service';
import { PostLocation, Image } from './../post-location'
import { MyPlanService } from '../my-plan.service';
import { MyPlan } from '../my-plan';



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
  plans = []
  locations = [1, 2, 4]

  public planControl: FormControl = new FormControl('');
  public locationControl: FormControl = new FormControl('');
  public descControl: FormControl = new FormControl('');


  constructor(private postLocationService: PostLocationService, private myPlanService: MyPlanService) { }

  ngOnInit(): void {
    this.myPlanService.getMyPlans().subscribe(myPlans => {
      for (let i = 0; i < myPlans.length; i++) {
        this.plans.push(myPlans[i])
      }
    })
  }

  _handleReaderLoaded(readerEvt) {
    this.imageStrings.push({ image: readerEvt.target.result });
    this.updatePostButtonDisabled();
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
    this.imageStrings.splice(i, 1);
    this.updatePostButtonDisabled()
  }

  post() {
    this.postLocationService.sendPostLocation(new PostLocation(
      'location_post',
      this.descControl.value,
      '1',
      this.locationControl.value,
      this.imageStrings
    ))
  }

  updatePostButtonDisabled() {
    console.log("u" + this.descControl.value.length + "  "
      + this.imageStrings.length + "  "
      + this.planControl.value + "  "
      + this.locationControl.value)

    if (this.descControl.value != undefined) {
      if (this.descControl.value.length > 0
        && this.imageStrings.length > 0
        && this.planControl.value
        && this.locationControl.value) {
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

  onPlanChange(value) {
    console.log("p" + value)
    if (value != undefined) {
      this.updatePostButtonDisabled()
    }
  }

  onLocationChange(value) {
    console.log("l" + value)
    if (value != undefined) {
      this.updatePostButtonDisabled()
    }
  }
}
