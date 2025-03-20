import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeOfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { IOfferService } from 'src/app/core/services/i.offer.service';
import { IRequestService } from 'src/app/core/services/i.request.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';
import { REQUEST_SERVICE } from 'src/app/service/request.service';

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrl: './make-offer.component.scss'
})
export class MakeOfferComponent {
  request: RequestModel;
  targetDate: Date;
  tableData: any;

  priceList: (number | null)[] = [];
  rowPriceList: (number | null)[] = [];
  dueDate: number;
  notes: string;
  requestId: number;
  selectedFile: File | null = null;
  expirationDate: Date

  constructor(
    @Inject(REQUEST_SERVICE) protected service: IRequestService,
    @Inject(OFFER_SERVICE) protected offerService: IOfferService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: NotificationHelper
  ) { }

  ngOnInit() {
    this.getRequest();
  }

  async getRequest() {
    this.route.params.subscribe(async params => {
      this.requestId = params['id'];

      this.request = await this.service.getById(this.requestId.toString());
      this.targetDate = this.request.bidCollectionEndDate;
      this.tableData = JSON.parse(this.request.template.data);
      this.priceList = new Array(this.tableData.rows.length).fill(null);
      this.rowPriceList = new Array(this.tableData.rows.length).fill(null);
    });
  }

  onPriceChange(rowIndex: number): void {
    const unitPrice = this.priceList[rowIndex];
    const unitCount = Number(this.tableData.rows[rowIndex]['quantity']);

    if ((unitPrice || unitPrice == 0) && unitCount)
      this.rowPriceList[rowIndex] = unitPrice * unitCount;
    else
      this.rowPriceList[rowIndex] = null;
  }

  onFileReceived(file: File | null): void {
    this.selectedFile = file;
  }

  async submitOffer() {
    if (this.priceList.some(x => !x || x === 0)) {
      this.messageService.showError("Lütfen birim fiyat bilgilerini girin")

      return;
    }

    if (!this.dueDate) {
      this.messageService.showError("Lütfen vade tarihini gün olarak girin")

      return;
    }

    const data = {
      maturityDays: this.dueDate,
      priceList: this.priceList,
      requestId: this.requestId,
      notes: this.notes || '',
      expirationDate: this.expirationDate,
    } as MakeOfferModel

    await this.offerService.makeOffer(data, this.selectedFile);

    this.router.navigate(["/offers/current-requests"]);
  }
}
