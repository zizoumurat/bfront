import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { IOfferService } from 'src/app/core/services/i.offer.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';


@Component({
  selector: 'app-offer-box',
  templateUrl: './offer-box.component.html',
  styleUrl: './offer-box.component.scss'
})

export class OfferBoxComponent implements OnChanges {
  @Output() offerChanged = new EventEmitter<void>();
  @Input() offer: OfferModel | undefined;
  @Input() request: RequestModel | undefined;
  @Input() currencyCode: string;
  @Input() isAllocation: boolean = true;
  @Input() hideButtons: boolean = false;

  offerModel: any;
  visibleOfferNotes: boolean;
  documentUrl: SafeResourceUrl | undefined;
  fileType: string;
  allocationCreated: boolean;

  currencyEnum: FormatEnum = FormatEnum.currency;

  constructor(
    @Inject(OFFER_SERVICE) protected offerService: IOfferService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['offer']) {
      this.initialOffer();
    }
  }

  initialOffer() {
    this.allocationCreated = this.offer.offerDetails.some(x => x.allocation)
    this.offerModel = {
      ...this.offer,
      columns: [
        { name: 'unit', title: this.translateService.instant("unitPrice"), type: FormatEnum.currency },
        { name: 'maturity', title: this.translateService.instant("maturity"), type: FormatEnum.day },
        ...(this.isAllocation || this.allocationCreated ? [{ name: 'allocation', title: this.translateService.instant("allocation") }] : []),
      ],
      rows: this.offer.offerDetails.map((detail) => ({
        unit: detail.unitPrice,
        maturity: this.offer.maturityDays,
        ...(this.isAllocation || this.allocationCreated ? { allocation: detail.allocation } : {}),
      }))
    };

    if (this.offer.document) {
      this.loadDocument(this.offer.documentUrl, this.offer.document.fileType)
    }
  }

  showNotes() {
    this.visibleOfferNotes = true;
  }

  binaryToBase64(binary: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < binary.length; i++) {
      binaryString += String.fromCharCode(binary[i]);
    }
    return btoa(binaryString);
  }

  loadDocument(base64Content: string, fileType: string) {
    const objectUrl = `data:${fileType};base64,${base64Content}`;
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    this.fileType = fileType;
  }

  async addToShortList() {
    await this.offerService.addToShortList(this.offer.id)

    this.offerChanged.emit();
  }

  async removeToShortList() {
    await this.offerService.removeToShortList(this.offer.id)

    this.offerChanged.emit();
  }

  async addToFavorite() {
    await this.offerService.addToFavorite(this.offer.id)

    this.offerChanged.emit();
  }

  async removeToFavorite() {
    await this.offerService.removeToFavorite(this.offer.id)

    this.offerChanged.emit();
  }


  async requestRevision() {
    await this.offerService.requestRevision(this.offer.id);

    this.offerChanged.emit();
  }
}
