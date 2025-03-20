import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from 'src/app/core/domain/category.model';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { TemplateModel } from 'src/app/core/domain/template.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { ICategoryService } from 'src/app/core/services/i.category.service';
import { IOfferService } from 'src/app/core/services/i.offer.service';
import { IRequestService } from 'src/app/core/services/i.request.service';
import { ITemplateService } from 'src/app/core/services/i.template.service';
import { CATEGORY_SERVICE } from 'src/app/service/category.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';
import { REQUEST_SERVICE } from 'src/app/service/request.service';
import { TEMPLATE_SERVICE } from 'src/app/service/template.service';

@Component({
  selector: 'app-approval-request-detail',
  templateUrl: './approval-request-detail.component.html'
})
export class ApprovalRequestDetailComponent {
  summaryTableColumns: any[];
  summaryTableData: any[];
  summaryTable: { columns: any[], rows: any[], currencyCode: string };
  filterButtons: any[];
  activeFilter: number = 0;
  template: TemplateModel;
  request: RequestModel
  requestInfo: any;
  category: CategoryModel;
  requestId: number;
  choosenType: number = 1;
  offers: OfferModel[];
  filteredOffers: OfferModel[];

  form: FormGroup;
  approvalForm: FormGroup;


  constructor(
    @Inject(REQUEST_SERVICE) private service: IRequestService,
    @Inject(OFFER_SERVICE) private offerService: IOfferService,
    @Inject(TEMPLATE_SERVICE) private templateService: ITemplateService,
    @Inject(CATEGORY_SERVICE) private categoryService: ICategoryService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: NotificationHelper,
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.requestId = params['id'];
    });
    this.summaryTableColumns = [
      { label: 'Katılımcı Listesi', field: 'name', },
      { label: 'Genel Sıralama', field: 'order', },
      { label: 'Toplam Fiyat', field: 'totalPrice', type: FormatEnum.currency },
      { label: 'Ortalama Birim Fiyat', field: 'avarageUnitPrice', type: FormatEnum.currency },
    ]

    this.filterButtons = ['Tüm Teklifler', 'Kısa Listeye Eklenenler', 'Opsiyon Teklifler', 'Revize Teklifler']

    this.createApprovalForm();
    this.getRequest();
  }

  createApprovalForm() {
    const control = (defaultValue: any, validators: any[] = []) =>
      this.fb.control(defaultValue, { validators });

    this.approvalForm = this.fb.group({
      id: control(null, [Validators.required]),
      status: control(null, [Validators.required]),
      comment: control(null),
    });
  }

  async getRequest() {
    this.request = await this.service.getById(this.requestId.toString());
    this.requestInfo = { ...this.request };
    const { mainCategoryId, subCategoryId, requestGroupId } = this.request;
    this.category = await this.categoryService.getCategoryId({ mainCategoryId, subCategoryId, requestGroupId })
    this.getOfferList();
  }

  async getOfferList() {
    this.offers = await this.offerService.getListByRequest(this.requestId);
    this.filteredOffers = this.offers;
    const sortedOffers = this.offers.sort((a, b) => {
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
      order: `En iyi ${index + 1}. Teklif`,  // Sıralı olarak 'En iyi 1. Teklif', 'En iyi 2. Teklif' vb.
      totalPrice: offer.totalPrice,
      avarageUnitPrice: offer.averageUnitPrice,
    }));

    this.summaryTable = { columns: this.summaryTableColumns, rows: this.summaryTableData, currencyCode: this.request.code };
  }

  applyFilter(index: number) {
    this.activeFilter = index;

    if (index === 0) {
      this.filteredOffers = this.offers;
    }

    if (index === 1) {
      this.filteredOffers = this.offers.filter(x => x.addedToShortList)
    }

    if (index === 2) {
      this.filteredOffers = this.offers.filter(x => x.isOptional)
    }

    if (index === 3) {
      this.filteredOffers = this.offers.filter(x => x.isRevised)
    }
  }


  async onSubmitStartForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.service.startApprovalProcess(this.form.value);
    // this.router.navigate(["/offers/request-selection"]);
  }

  offerChange() {
    this.getOfferList();
  }

  allocation() {
    this.router.navigate(["/offers/allocation/" + this.request.id]);
  }

  async sendApproveForm(status) {

    this.approvalForm.get('id').setValue(this.request.id);
    this.approvalForm.get('status').setValue(status ? ApprovalStatus.Approved : ApprovalStatus.Rejected);

    if (this.approvalForm.valid) {

      await this.service.approveRejectRequest(this.approvalForm.value);

      this.router.navigate(["/approvals/requests-pending-approval"]);
    }
  }
}
