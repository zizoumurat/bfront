import { Component, Input } from '@angular/core';
import { RequestModel } from 'src/app/core/domain/request.model';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrl: './info-box.component.scss'
})

export class InfoBoxComponent {
  @Input() request: RequestModel;
}
