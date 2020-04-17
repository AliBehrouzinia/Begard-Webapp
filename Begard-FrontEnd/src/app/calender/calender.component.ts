
import { Component, ViewChild, OnInit } from '@angular/core';
import { extend, closest } from '@syncfusion/ej2-base';
import { EventSettingsModel, View, DayService, WeekService, DragAndDropService, ResizeService, ScheduleComponent, CellClickEventArgs, DragEventArgs, ResizeEventArgs } from '@syncfusion/ej2-angular-schedule';
import { GridComponent, RowDDService, EditService, EditSettingsModel, RowDropSettingsModel } from '@syncfusion/ej2-angular-grids';
import { hospitalData, waitingList } from './data';
import { L10n } from '@syncfusion/ej2-base';
import { DataStorageService, PlanItem, Plan } from '../data-storage.service';
import { ActivatedRoute } from '@angular/router';
import { PlanningItem } from '../plan-item.model';
import { Location } from '../location'
import { last } from 'rxjs/operators';
import { LocationService } from '../map/location.service';
import { MapLocationService } from '../map-locations.service';



L10n.load({
  'en-US': {
    'schedule': {
      'saveButton': 'Add',
      'cancelButton': 'Close',
      'deleteButton': 'Remove',
      'newEvent': 'Add Plan',
      'editEvent': 'Edit Plan'
    }
  }
});


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
  providers: [DayService, WeekService, DragAndDropService, ResizeService, RowDDService, EditService]
})
export class CalenderComponent implements OnInit {

  planItems: PlanningItem[] = [];
  gridItems: PlanningItem[] = [];

  constructor(
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
    private location: MapLocationService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      var plan: Plan = data['plan'];
      this.location.setLocation(plan.plan.plan_items);
      for (var i = 0; i < plan.plan.plan_items.length; i++) {
        this.planItems.push(new PlanningItem(
          new Date(plan.plan.plan_items[i].start_date).toISOString()
          , new Date(plan.plan.plan_items[i].finish_date).toISOString()
          , plan.plan.plan_items[i].place_name
          , plan.plan.plan_items[i].place_info.id
        ));
        this.gridItems.push(new PlanningItem(
          new Date(plan.plan.plan_items[i].start_date).toISOString()
          , new Date(plan.plan.plan_items[i].finish_date).toISOString()
          , plan.plan.plan_items[i].place_name
          , plan.plan.plan_items[i].place_info.id
        ));

      }
    });

  }

  public isSelected: boolean = true;
  public dayInterval: number = 3;
  public weeksInterval: number = 2;
  public weekInterval: number = 1;
  title = 'drag-resize-actions';
  public selectedDate: Date = new Date(2020,3,15);
  public currentView: View = 'Week';
  public setViews: View[] = ['Day', 'Week', 'Month'];


  public dateParser(data: string) {
    return new Date(data);
  }
  // public statusFields: Object = { text: 'StatusText', value: 'StatusText'};
  // public StatusData : Object[]=[
  //   {StatusText:'New'},
  //   {StatusText:'Requested'},
  //   {StatusText:'Confirmed'}
  // ];

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('gridObj')
  public gridObj: GridComponent;


  public eventSettings: EventSettingsModel = {
    dataSource: this.planItems,
    fields: {
      id: 'placeId',
      subject: { name: 'placeName' },
      startTime: { name: 'startDate' },
      endTime: { name: 'finishDate' },
    }
  };

  // Grid data
  public gridDS: Object = waitingList;
  public allowDragAndDrop: boolean = true;
  public srcDropOptions: RowDropSettingsModel = { targetID: 'Schedule' };
  public primaryKeyVal: boolean = true;
  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true
  };

  onRowDrag(event: any): void {
    event.cancel = true;
  }

  onDragStop(event: any): void {
    event.cancel = true;
    let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
    if (scheduleElement) {
      if (event.target.classList.contains('e-work-cells')) {
        const filteredData: Object = event.data;
        let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
        var newPlan: PlanningItem = new PlanningItem(
          cellData.startTime.toISOString()
          , cellData.endTime.toISOString()
          , filteredData[0].placeName
          , filteredData[0].placeId + 'a'
        );
        this.scheduleObj.addEvent(newPlan)
        this.gridObj.deleteRecord(event.data[0]);
      }
    }
  }

  onDragStart(args: DragEventArgs): void {
    args.scroll.enable = true;
    // args.scroll.scrollBy=500;
    args.interval = 1;
    args.navigation.enable = true;

  }

  onResizeStart(args: ResizeEventArgs): void {
    args.scroll.enable = true;
    args.interval = 1;

  }

  addToLocationList(location) {
    this.gridObj.addRecord( new PlanningItem(
      this.gridItems[0].startDate
      , this.gridItems[0].finishDate
      , location.name
      , location.id
    ));
  }
}
