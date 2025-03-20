import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { TemplateModel } from 'src/app/core/domain/template.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { RequestStateEnum, ReverseAuctionStatusEnum } from 'src/app/core/enums/request.enum';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { IOfferService } from 'src/app/core/services/i.offer.service';
import { IRequestService } from 'src/app/core/services/i.request.service';
import { IReverseAuctionService } from 'src/app/core/services/i.reverseAuction.service';
import { ITemplateService } from 'src/app/core/services/i.template.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';
import { REQUEST_SERVICE } from 'src/app/service/request.service';
import { REVERSEAUCTION_SERVICE } from 'src/app/service/reverseAuction.service';
import { TEMPLATE_SERVICE } from 'src/app/service/template.service';
import { TemplateTableComponent } from '../components/template-table/template-table.component';
import { ReverseAuctionModel } from 'src/app/core/domain/reverseAuction.model';
import { CountdownSignalRService } from 'src/app/core/helpers/signalR/CountdownSignalRService';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';

@Component({
  selector: 'app-reverse-auction-supplier',
  templateUrl: './reverse-auction-supplier.component.html',
  styleUrl: './reverse-auction-supplier.component.scss'
})
export class ReverseAuctionSupplierComponent {
  @ViewChild(TemplateTableComponent) templateTable!: TemplateTableComponent;

  ReverseAuctionStatusEnum = ReverseAuctionStatusEnum;
  RequestStateEnum = RequestStateEnum;
  summaryTableColumns: any[];
  summaryTableData: any[];
  summaryTable: { columns: any[], rows: any[], currencyCode: string };

  activeFilter: number = 0;
  template: TemplateModel;
  request: RequestModel;
  reverseAuction: ReverseAuctionModel;
  requestId: number;
  choosenType: number = 1;
  offers: OfferModel[];
  filteredOffers: OfferModel[];
  isDisabled: boolean = true;

  constructor(
    @Inject(REQUEST_SERVICE) private service: IRequestService,
    @Inject(REVERSEAUCTION_SERVICE) private reverseAuctionService: IReverseAuctionService,
    @Inject(OFFER_SERVICE) private offerService: IOfferService,
    @Inject(TEMPLATE_SERVICE) private templateService: ITemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: NotificationHelper,
    private fb: FormBuilder,
    private signalRService: CountdownSignalRService,
    private authHelper: AuthHelper
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.requestId = params['id'];
    });

    this.signalRService.startConnection().then(() => {
      return this.signalRService.joinGroup(this.requestId.toString());
    })

    this.signalRService.onChangePrice(() => {
      this.getRequest();
    });


    this.signalRService.onChangeStatu(() => {
      this.getRequest();
    });

    this.summaryTableColumns = [
      { label: 'Katılımcı Listesi', field: 'name', },
      { label: 'Genel Sıralama', field: 'order', },
      { label: 'Toplam Fiyat', field: 'totalPrice', type: FormatEnum.currency },
      { label: 'Ortalama Birim Fiyat', field: 'avarageUnitPrice', type: FormatEnum.currency },
    ]
    this.getRequest();
  }

  async getRequest() {
    this.request = await this.service.getById(this.requestId.toString());

    this.getOfferList();
    this.getReverseAuction();
  }


  async getReverseAuction() {
    this.reverseAuction = await this.reverseAuctionService.getById(this.request.reverseAuctionId.toString());
    this.checkUpdateDisabled();
  }

  async getOfferList() {
    this.offers = await this.offerService.getListByRequest(this.requestId);
    this.filteredOffers = this.offers;


    const sortedOffers = this.filteredOffers.sort((a, b) => {
      if (a.totalPrice !== b.totalPrice) {
        return a.totalPrice - b.totalPrice;  // Küçükten büyüğe sıralama
      }

      if (a.averageUnitPrice !== b.averageUnitPrice) {
        return a.averageUnitPrice - b.averageUnitPrice;  // Küçükten büyüğe sıralama
      }

      return (a.maturityDays ?? 0) - (b.maturityDays ?? 0);  // Küçükten büyüğe sıralama, null değerler için 0 kullanıyoruz
    });

    this.summaryTableData = sortedOffers.map((offer, index) => ({
      name: offer.companyName,
      order: `En iyi ${index + 1}. Teklif`,
      totalPrice: offer.totalPrice,
      avarageUnitPrice: offer.averageUnitPrice,
    }));

    this.summaryTable = { columns: this.summaryTableColumns, rows: this.summaryTableData, currencyCode: this.request.code };
    this.checkUpdateDisabled();
  }

  checkUpdateDisabled() {
    this.isDisabled = !this.filteredOffers || !this.filteredOffers.some(offer =>
      offer.offerDetails.some(detail => detail.unitPrice !== detail.firstUnitPrice)
    );

    this.isDisabled = !!this.reverseAuction && this.reverseAuction.statu !== ReverseAuctionStatusEnum.Started;
  }

  onPriceChange(event) {
    const offerDetail = this.filteredOffers
      .map(offer => offer.offerDetails)
      .flat()
      .find(detail => detail.id === event.offerDetailId);

    if (offerDetail) {
      offerDetail.unitPrice = event.price;
      this.checkUpdateDisabled();
    }
  }

  updateOfferPrice() {
    const updatedOfferDetails = this.filteredOffers
      .map(offer => offer.offerDetails)
      .flat()
      .filter(detail => detail.unitPrice !== detail.firstUnitPrice)
      .map(detail => ({
        offerDetailId: detail.id,
        newUnitPrice: detail.unitPrice
      }));

    this.offerService.updatePrices(updatedOfferDetails)
  }

  isStatusRestricted(status: ReverseAuctionStatusEnum): boolean {
    return status === ReverseAuctionStatusEnum.Paused ||
      status === ReverseAuctionStatusEnum.NotStarted ||
      status === ReverseAuctionStatusEnum.Ended ||
      status === ReverseAuctionStatusEnum.Cancelled;
  }

  getStatusMessage(status: ReverseAuctionStatusEnum): string {
    switch (status) {
      case ReverseAuctionStatusEnum.Paused:
        return 'Oturum duraklatıldığı için fiyat güncellemesi yapılamaz.';
      case ReverseAuctionStatusEnum.NotStarted:
        return 'Oturum henüz başlamadığı için fiyat güncellemesi yapılamaz.';
      case ReverseAuctionStatusEnum.Cancelled:
        return 'Oturum iptal edildiği için fiyat güncellemesi yapılamaz.';
      case ReverseAuctionStatusEnum.Ended:
        return 'Oturum sona erdiği için fiyat güncellemesi yapılamaz.';
      default:
        return 'Bilinmeyen bir durumda fiyat güncellemesi yapılamaz.';
    }
  }
}
