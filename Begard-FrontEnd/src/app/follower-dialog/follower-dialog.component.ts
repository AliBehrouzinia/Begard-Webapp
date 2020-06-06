import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Follower } from '../follow.service';

@Component({
  selector: 'app-follower-dialog',
  templateUrl: './follower-dialog.component.html',
  styleUrls: ['./follower-dialog.component.css']
})
export class FollowerDialogComponent implements OnInit {
  users = [1,2,3,4]
  constructor(public dialogRef: MatDialogRef<FollowerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Follower[]) { }

  ngOnInit(): void {
    this.users = this.data['followers'];
  }

}
