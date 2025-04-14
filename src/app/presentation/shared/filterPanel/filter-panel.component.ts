import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
})
export class FilterPanelComponent implements OnInit {
  @Input() filterConfig: any[] = [];
  @Output() searchObjectChange = new EventEmitter<any>();
  @Output() selectChange = new EventEmitter<{ controlName: string; value: any }>();

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const formControls = this.filterConfig.reduce((acc, field) => {
      acc[field.controlName] = [null];
      return acc;
    }, {});
    this.filterForm = this.fb.group(formControls);
  }

  listenToFormChanges() {
    this.filterForm.valueChanges.subscribe((formValues) => {
      this.searchObjectChange.emit(formValues);
    });
  }

  onDropdownChange(controlName: string, value: any) {
    this.selectChange.emit({ controlName, value });

    var field = this.filterConfig.find(x => x.controlName === controlName);

    if (field && field.relation)
      this.filterForm.get(field.relation).setValue(null)
  }

  resetFilterForm() {
    this.filterForm.reset();
    this.searchObjectChange.emit(null);
  }

  submitFilter() {
    const updatedSearchObject = { ...this.filterForm.value };
    this.searchObjectChange.emit(updatedSearchObject);
  }
}
