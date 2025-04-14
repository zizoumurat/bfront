import { Directive, Input } from "@angular/core";
import { Calendar } from "primeng/calendar";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "p-calendar",
})
export class CalendarDirective {
  @Input() todayButtonStyleClass = "p-button-info ml5";
  constructor(calendar: Calendar) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    calendar.dateFormat = "dd/mm/yy";
    calendar.autoZIndex = true;
    calendar.baseZIndex = 100000;
    calendar.appendTo = "body";
    calendar.readonlyInput = true;
    calendar.showIcon = true;
    calendar.yearNavigator = true;
    calendar.yearRange = "1900:2030";
    calendar.monthNavigator = true;
    calendar.showButtonBar = true;
    calendar.todayButtonStyleClass = this.todayButtonStyleClass;
    calendar.clearButtonStyleClass = "p-button-danger mr5";
    calendar.firstDayOfWeek = 0;
    calendar.selectOtherMonths = true;
    calendar.minDate = today;
  }
}
