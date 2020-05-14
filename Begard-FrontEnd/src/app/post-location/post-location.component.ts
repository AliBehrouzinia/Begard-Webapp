import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostLocationService } from '../post-location.service';
import { PostLocation, Image } from './../post-location'
import { MyPlanService } from '../my-plan.service';
import { MyPlan } from '../my-plan';
import { MyLocationService } from '../my-location.service';
import { ProfileService } from '../profile/profile.service';
import { UserService } from '../user.service';
import { exhaustMap } from 'rxjs/operators';
import { Profile } from '../profile';



@Component({
  selector: 'app-post-location',
  templateUrl: './post-location.component.html',
  styleUrls: ['./post-location.component.css']
})
export class PostLocationComponent implements OnInit {
  SERVER_URL = 'http://127.0.0.1:8000';

  images = []
  imageStrings: Image[] = []
  imagePath;
  message;
  imgURL;
  locationDisabled = true;

  postDisabled = true;
  plans = []
  locations = []

  username;
  profileImage = "";

  public planControl: FormControl = new FormControl('');
  public locationControl: FormControl = new FormControl('');
  public descControl: FormControl = new FormControl('');


  constructor(private postLocationService: PostLocationService
    , private myPlanService: MyPlanService
    , private myLocationService: MyLocationService
    , private userService: UserService
    , private profileService: ProfileService) { }

  ngOnInit(): void {
    this.myPlanService.getMyPlans().subscribe(myPlans => {
      for (let i = 0; i < myPlans.length; i++) {
        this.plans.push(myPlans[i])
      }
    })

    this.userService.getUserId().subscribe(user => { 
        this.profileService.getHeaderData(user.pk).subscribe( profile => {
          this.username = profile.username
          this.profileImage += this.SERVER_URL + profile.profile_image;
        })
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
      this.planControl.value.id,
      this.locationControl.value.place_id,
      this.locationControl.value.place_name,
      this.imageStrings
    ))
    this.clear();
  }

  clear() {
    this.images = []
    this.imageStrings = []
    this.planControl.setValue('')
    this.locationControl.setValue('')
    this.descControl.setValue('')
    this.updatePostButtonDisabled()
  }

  updatePostButtonDisabled() {
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

  onPlanChange(plan) {
    if (plan != undefined) {
      this.updatePostButtonDisabled()
      this.locationDisabled = false;
      this.myLocationService.getMyLocations(plan.id).subscribe(myLocations => {
        for (let i = 0; i < myLocations.length; i++) {
          this.locations.push(myLocations[i])
        }
      })
    } else {
      this.locationDisabled = true;
    }
  }

  onLocationChange(location) {
    if (location != undefined) {
      this.updatePostButtonDisabled()
    }
  }
}
