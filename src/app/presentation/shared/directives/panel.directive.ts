import { Directive } from '@angular/core';
import { Panel } from 'primeng/panel';

@Directive({
  selector: 'p-panel',
})
export class PanelDirective {
  constructor(panel: Panel) {
    panel.collapsed = false;
    panel.expandIcon = 'pi pi-angle-up';    
    panel.collapseIcon = 'pi pi-angle-down';  
  }
}