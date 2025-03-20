import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';

@Component({
  selector: 'app-offer-box-list',
  templateUrl: './offer-box-list.component.html',
  styleUrl: './offer-box-list.component.scss'
})
export class OfferBoxListComponent {
  @Output() priceChange: EventEmitter<{ offerDetailId: number, price: number }> = new EventEmitter();
  @Output() offerChanged = new EventEmitter<void>();
  @Input() offerList: OfferModel[] | undefined;
  @Input() request: RequestModel | undefined;
  @Input() isAllocation: boolean;
  @Input() hideButtons: boolean = false;
  @Input() isReverseAuction: boolean = false;
  @Input() showCompanyName: boolean = false;

  ngOnInit() {
  }

  offerChange() {
    this.offerChanged.emit();
  }

  onPriceChange(event) {
    this.priceChange.emit(event)
  }
}
