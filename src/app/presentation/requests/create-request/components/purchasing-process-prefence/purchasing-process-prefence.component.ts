import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchasing-process-prefence',
  templateUrl: './purchasing-process-prefence.component.html',
  styleUrl: './purchasing-process-prefence.component.scss'
})
export class PurchasingProcessPrefenceComponent {
  requestId: number;
  constructor(private router: Router,  private route: ActivatedRoute){}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      if (params.get('id')) {
        this.requestId = Number(params.get('id'));
      }
    })
  }

  startComplatePurchaseRequest(type: number) {
    this.router.navigateByUrl(`requests/purchasing-process-preference/${this.requestId}/complete/${type}`)
  }
}
