import { Directive, Input } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';

@Directive({
  selector: 'p-dropdown',
})
export class DropDownDirective {
  @Input() optionLabel = 'name';
  @Input() optionValue = 'id';
  
  constructor(dropDown: Dropdown) {
    dropDown.optionLabel = this.optionLabel;
    dropDown.optionValue = this.optionValue;
    dropDown.autoDisplayFirst = false;
    dropDown.appendTo = 'body';
  }
}
