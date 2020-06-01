import { Component, ViewChild, OnInit } from '@angular/core';
import { closest } from '@syncfusion/ej2-base';
import { EventSettingsModel, View, DayService, WeekService, DragAndDropService, ResizeService, ScheduleComponent, CellClickEventArgs, DragEventArgs, ResizeEventArgs } from '@syncfusion/ej2-angular-schedule';
import { GridComponent, RowDDService, EditService, EditSettingsModel, RowDropSettingsModel } from '@syncfusion/ej2-angular-grids';
import { L10n } from '@syncfusion/ej2-base';
import { DataStorageService, PlanItem, MyPlan } from '../data-storage.service';
import { ActivatedRoute } from '@angular/router';
import { PlanningItem } from '../plan-item.model';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from './../post-dialog/post-dialog.component';
import { PostPlan, PI } from '../post-plan';
import { PostPlanService } from '../post-plan.service';
import { MapLocationService } from '../map-locations.service';
import { BehaviorSubject } from 'rxjs'


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
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
  providers: [DayService, WeekService, DragAndDropService, ResizeService, RowDDService, EditService]
})
export class PlanComponent implements OnInit {
  planId
  plan: MyPlan
  postPlan: PostPlan;
  pi: PI[];
  cityId

  planItems: PlanningItem[] = [];
  gridItems$: BehaviorSubject<PlanningItem[]> = new BehaviorSubject<PlanningItem[]>([]) ;

  constructor(
    public dataService: DataStorageService,
    public postPlanService: PostPlanService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: MapLocationService
  ) { }


  ngOnInit() {
    let gridItems: PlanningItem[] = [];
    this.route.paramMap.subscribe(params => {
      this.dataService.getPlan(params.get('planId')).subscribe(data => {
        this.plan = data['plan'];
        this.cityId = this.plan.destination_city_id
        this.location.setLocation(this.plan.plan_items);
        for (var i = 0; i < this.plan.plan_items.length; i++) {
          this.planItems.push(new PlanningItem(
            new Date(this.plan.plan_items[i].start_date).toISOString()
            , new Date(this.plan.plan_items[i].finish_date).toISOString()
            , this.plan.plan_items[i].place_name
            , this.plan.plan_items[i].place_info.id
            , this.plan.plan_items[i].place_info.id + i
          ));
          gridItems.push(new PlanningItem(
            new Date(this.plan.plan_items[i].start_date).toISOString()
            , new Date(this.plan.plan_items[i].finish_date).toISOString()
            , this.plan.plan_items[i].place_name
            , this.plan.plan_items[i].place_info.id
            , this.plan.plan_items[i].place_info.id + i
          ));
        }
        this.gridItems$.next(gridItems);
        this.selectedDate = new Date(this.plan.plan_items[0].start_date);
      });
    });
  }

  public isSelected: boolean = true;
  public dayInterval: number = 3;
  public weeksInterval: number = 2;
  public weekInterval: number = 1;
  title = 'drag-resize-actions';
  public selectedDate: Date;
  public currentView: View = 'Week';
  public setViews: View[] = ['Day', 'Week', 'Month'];


  public dateParser(data: string) {
    return new Date(data);
  }

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
  public gridDS: Object;
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
          , filteredData[0].placeId
          , filteredData[0].placeId + 'a'
        );
        this.scheduleObj.addEvent(newPlan)
        this.gridObj.deleteRecord(event.data[0]);
      }
    }
  }

  onDragStart(args: DragEventArgs): void {
    args.scroll.enable = true;
    args.interval = 1;
    args.navigation.enable = true;

  }

  onResizeStart(args: ResizeEventArgs): void {
    args.scroll.enable = true;
    args.interval = 1;

  }

  addToLocationList(location) {
    this.gridObj.addRecord(new PlanningItem(
      location.start_date
      , location.finish_date
      , location.name
      , location.place_id
      , location.place_id
    ));
  }

  openDialog(): void {
    this.pi = [];
    this.planItems.forEach(pi => {
      this.pi.push({ start_date: pi.startDate, finish_date: pi.finishDate, place_id: pi.placeId })
    });

    const dialogRef = this.dialog.open(PostDialogComponent, {
      maxWidth: '1200px',
      maxHeight: '800px',
      minWidth: '550px',
      height: 'auto',
      width: 'auto',
      data: {
        id: this.plan.id, description: this.plan.description, cover: this.plan.cover
        , plan_items: this.pi, creation_date: this.plan.creation_date
        , destination_city_id: this.plan.destination_city_id, destination_city_name: this.plan.destination_city_name
        , start_date: this.plan.start_date, finish_date: this.plan.finish_date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addPlanDetails(postDetil) {
  }

}
