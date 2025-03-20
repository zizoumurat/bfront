import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { IOfferService } from 'src/app/core/services/i.offer.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';


@Component({
  selector: 'app-reverse-auction-offer-box',
  templateUrl: './reverse-auction-offer-box.component.html',
  styleUrl: './reverse-auction-offer-box.component.scss'
})

export class ReverseAuctionOfferBoxComponent implements OnChanges {
  @Output() priceChange: EventEmitter<{ offerDetailId: number, price: number }> = new EventEmitter();
  @Input() offer: OfferModel | undefined;
  @Input() request: RequestModel | undefined;
  @Input() currencyCode: string;
  @Input() showCompanyName: boolean = false;

  offerModel: any;
  visibleOfferNotes: boolean;
  documentUrl: SafeResourceUrl | undefined;
  fileType: string;
  allocationCreated: boolean;

  currencyEnum: FormatEnum = FormatEnum.currency;
  FormatEnum = FormatEnum;

  isOwner: boolean;

  constructor(
    @Inject(OFFER_SERVICE) protected offerService: IOfferService,
    private translateService: TranslateService,
    private authHelper: AuthHelper,
    private sanitizer: DomSanitizer) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['offer']) {
      this.initialOffer();

      var user = this.authHelper.getCurrentUser();

      this.isOwner = this.offer.companyId == user.companyId;
    }
  }

  initialOffer() {
    this.allocationCreated = this.offer.offerDetails.some(x => x.allocation);
    this.offerModel = {
      ...this.offer,
      columns: [
        { name: 'firstUnitPrice', title: this.translateService.instant("previousUnitPrice"), type: FormatEnum.currency },
        { name: 'unitPrice', title: this.translateService.instant("currentUnitPrice"), type: FormatEnum.currency, style: { minWidth: '110px' } },
        { name: 'change', title: this.translateService.instant("variation"), type: FormatEnum.percentage },
        { name: 'maturity', title: this.translateService.instant("maturity"), type: FormatEnum.day },
      ],
      rows: this.offer.offerDetails.map((detail) => {
        const priceDifference = detail.unitPrice - detail.firstUnitPrice;
        const changePercentage = Math.round((priceDifference / detail.firstUnitPrice) * 100);
        return {
          offerDetailId: detail.id,
          firstUnitPrice: detail.firstUnitPrice,
          unitPrice: detail.unitPrice,
          change: changePercentage,
          maturity: this.offer.maturityDays,
        };
      })
    };
  }

  onPriceChange(rowIndex: number, newPrice: number) {
    this.offerModel.rows[rowIndex].unitPrice = newPrice;
    this.priceChange.emit({
      offerDetailId: this.offerModel.rows[rowIndex].offerDetailId,
      price: newPrice
    });
  }
}
