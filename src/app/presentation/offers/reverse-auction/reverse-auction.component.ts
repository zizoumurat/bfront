import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { TemplateModel } from 'src/app/core/domain/template.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { RequestStateEnum } from 'src/app/core/enums/request.enum';
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
import { ReverseAuctionStatusEnum } from 'src/app/core/enums/request.enum';
import { CountdownSignalRService } from 'src/app/core/helpers/signalR/CountdownSignalRService';
import { CountDownReverseAuctionComponent } from '../components/count-down-reverse-auction/count-down-reverse-auction.component';

@Component({
  selector: 'app-reverse-auction',
  templateUrl: './reverse-auction.component.html',
  styleUrl: './reverse-auction.component.scss'
})
export class ReverseAuctionComponent {
  @ViewChild(TemplateTableComponent) templateTable!: TemplateTableComponent;
  @ViewChild(CountDownReverseAuctionComponent) countdownComponent: CountDownReverseAuctionComponent;

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

  reverseAuctionSessionForm: FormGroup;

  constructor(
    @Inject(REQUEST_SERVICE) private service: IRequestService,
    @Inject(REVERSEAUCTION_SERVICE) private reverseAuctionService: IReverseAuctionService,
    @Inject(OFFER_SERVICE) private offerService: IOfferService,
    @Inject(TEMPLATE_SERVICE) private templateService: ITemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: NotificationHelper,
    private fb: FormBuilder,
    private signalRService: CountdownSignalRService
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

    this.summaryTableColumns = [
      { label: 'Katılımcı Listesi', field: 'name', },
      { label: 'Genel Sıralama', field: 'order', },
      { label: 'Toplam Fiyat', field: 'totalPrice', type: FormatEnum.currency },
      { label: 'Ortalama Birim Fiyat', field: 'avarageUnitPrice', type: FormatEnum.currency },
    ]

    this.createForm();
    this.getRequest();
  }

  async getRequest() {
    this.request = await this.service.getById(this.requestId.toString());

    this.getOfferList();
    this.getReverseAuction();
  }


  async getReverseAuction() {
    this.reverseAuction = await this.reverseAuctionService.getById(this.request.reverseAuctionId.toString());
    this.reverseAuctionSessionForm.patchValue(this.reverseAuction);
    this.reverseAuctionSessionForm.disable();
  }


  async getOfferList() {
    this.offers = await this.offerService.getListByRequest(this.requestId);
    this.filteredOffers = this.offers;
    const sortedOffers = this.offers.sort((a, b) => {
      if (a.totalPrice !== b.totalPrice) {
        return a.totalPrice - b.totalPrice;
      }

      if (a.averageUnitPrice !== b.averageUnitPrice) {
        return a.averageUnitPrice - b.averageUnitPrice;
      }

      return (a.maturityDays ?? 0) - (b.maturityDays ?? 0);
    });

    this.summaryTableData = sortedOffers.map((offer, index) => ({
      name: offer.companyName,
      order: `En iyi ${index + 1}. Teklif`,
      totalPrice: offer.totalPrice,
      avarageUnitPrice: offer.averageUnitPrice,
    }));

    this.summaryTable = { columns: this.summaryTableColumns, rows: this.summaryTableData, currencyCode: this.request.code };
  }

  createForm() {
    this.reverseAuctionSessionForm = this.fb.group({
      showCompanyNames: [],
      showAllOffers: [],
      showOfferRankings: [],
    });
  }

  saveTargetPrices() {
    this.templateTable.saveTemplate();
  }

  async changeStatus(statu: ReverseAuctionStatusEnum) {
    await this.reverseAuctionService.changeStatu(this.request.reverseAuctionId, statu,  this.countdownComponent.getSeconds());
    this.getReverseAuction();
  }
}
