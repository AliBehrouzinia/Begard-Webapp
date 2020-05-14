import { Component, OnInit, Input } from '@angular/core';
import { FollowService, FollowRequest } from '../follow.service';

@Component({
  selector: 'app-top-planners',
  templateUrl: './top-planners.component.html',
  styleUrls: ['./top-planners.component.css']
})
export class TopPlannersComponent implements OnInit {
  SERVER_URL = 'http://127.0.0.1:8000';

  @Input() userId
  @Input() email;
  @Input() username;
  @Input() rate;
  @Input() profileImg;
  @Input() isPublic;

  followButtonTitle = "Follow"
  allowFollowRequest = true;

  constructor(private followService: FollowService) { }

  ngOnInit(): void {
    this.email = this.email.substring(0, this.email.search('@'));

  }

  onFollow() {
    if (this.allowFollowRequest) {
      this.followService.sendFollowRequest({ request_to: this.userId }).subscribe(res => {
        console.log(JSON.stringify(res))
        this.handleResponse(res.status)
      })
    }
  }

  handleResponse(status) {
    if (status == "Requested") {
      this.followButtonTitle = "Requested"
      this.allowFollowRequest = false
    }
    else if (status == "Followed") {
      this.followButtonTitle = "Following"
      this.allowFollowRequest = false
    }
  }

}
