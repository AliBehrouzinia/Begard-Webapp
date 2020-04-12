
import { Component, ViewChild } from '@angular/core';
import { extend, closest } from '@syncfusion/ej2-base';
import { EventSettingsModel, View, DayService, WeekService, DragAndDropService, ResizeService, ScheduleComponent, CellClickEventArgs ,DragEventArgs,ResizeEventArgs} from '@syncfusion/ej2-angular-schedule';
import { GridComponent, RowDDService, EditService, EditSettingsModel, RowDropSettingsModel } from '@syncfusion/ej2-angular-grids';
import { hospitalData, waitingList } from './data';
import { L10n } from '@syncfusion/ej2-base';

L10n.load({
  'en-US': {
    'schedule':{
      'saveButton':'Add',
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
    providers:[DayService,WeekService]
})
export class CalenderComponent {
    public isSelected: Boolean = true;
    public dayInterval: number = 3;
    public weeksInterval: number = 2;
    public weekInterval: number = 1;
    title = 'drag-resize-actions';
    public selectedDate: Date = new Date(2018, 7, 1);
    public currentView: View = 'Week';
    public setViews : View[] = ['Day','Week','Month'];


    public dateParser(data : string){
      return new Date(data);
    }
    public statusFields: Object = { text: 'StatusText', value: 'StatusText'};
    public StatusData : Object[]=[
      {StatusText:'New'},
      {StatusText:'Requested'},
      {StatusText:'Confirmed'}
    ];

    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    @ViewChild('gridObj')
    public gridObj: GridComponent;

  // Scheduler data
    public data: Object[] = <Object[]>extend([], hospitalData, null, true);

    public eventSettings: EventSettingsModel = {
       dataSource: this.data,
       fields: {
           subject: { title: 'Time', name: 'Name' },
           startTime: { title: 'From', name: 'StartTime' },
           endTime: { title: 'To', name: 'EndTime' },
           description: { title: 'Reason', name: 'Description' }
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
            let eventData: { [key: string]: Object } = {
                  Id: filteredData[0].Id,
                  Name: filteredData[0].Name,
                  StartTime: cellData.startTime,
                  EndTime: cellData.endTime,
                  IsAllDay: cellData.isAllDay,
                  Description: filteredData[0].Description
             };
             this.scheduleObj.addEvent(eventData);
            // this.scheduleObj.openEditor(eventData, 'Add', true);
             this.gridObj.deleteRecord(event.data[0]);
           }
       }
    }

    onDragStart(args: DragEventArgs):void{
      args.scroll.enable = true;
      // args.scroll.scrollBy=500;
      args.interval=1;
      args.navigation.enable=true;

    }

    onResizeStart(args: ResizeEventArgs):void{
      args.scroll.enable = true;
      args.interval=1;

    }
}
