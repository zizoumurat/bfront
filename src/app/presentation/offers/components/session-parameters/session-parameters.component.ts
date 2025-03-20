import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-session-parameters',
  templateUrl: './session-parameters.component.html',
  styleUrl: './session-parameters.component.scss'
})

export class SessionParametersComponent {
  @Input() formGroup: FormGroup; 

  constructor() { }

  ngOnInit(): void {
  }
}
