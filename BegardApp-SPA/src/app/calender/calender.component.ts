
import { Component, ViewChild } from '@angular/core';
import { extend, closest } from '@syncfusion/ej2-base';
import { EventSettingsModel, View, DayService, WeekService, WorkWeekService, MonthService, DragAndDropService, ResizeService, ScheduleComponent, CellClickEventArgs } from '@syncfusion/ej2-angular-schedule';
import { GridComponent, RowDDService, EditService, EditSettingsModel, RowDropSettingsModel } from '@syncfusion/ej2-angular-grids';
import { hospitalData, waitingList } from './data';


@Component({
    selector: 'app-calender',
    templateUrl: './calender.component.html',
    styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
    title = 'drag-resize-actions';
    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    @ViewChild('gridObj')
    public gridObj: GridComponent;
  
  // Scheduler data
    public data: Object[] = <Object[]>extend([], hospitalData, null, true);
    public selectedDate: Date = new Date(2018, 7, 1);
    public currentView: View = 'Week';
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
}