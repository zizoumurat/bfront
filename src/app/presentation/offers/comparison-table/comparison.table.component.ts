import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferModel } from 'src/app/core/domain/offer.model';
import { RequestModel } from 'src/app/core/domain/request.model';
import { TemplateModel } from 'src/app/core/domain/template.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { IOfferService } from 'src/app/core/services/i.offer.service';
import { IRequestService } from 'src/app/core/services/i.request.service';
import { ITemplateService } from 'src/app/core/services/i.template.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';
import { REQUEST_SERVICE } from 'src/app/service/request.service';
import { TEMPLATE_SERVICE } from 'src/app/service/template.service';
import { OfferSelectionComponent } from '../components/offer-selection/offer-selection.component';
import { REVERSEAUCTION_SERVICE } from 'src/app/service/reverseAuction.service';
import { IReverseAuctionService } from 'src/app/core/services/i.reverseAuction.service';
import { ReverseAuctionModel } from 'src/app/core/domain/reverseAuction.model';

@Component({
  selector: 'app-comparison-table',
  templateUrl: './comparison.table.component.html',
  styleUrl: './comparison.table.component.scss'
})
export class ComparisonTableComponent {
  @ViewChild(OfferSelectionComponent) offerSelectionComponent!: OfferSelectionComponent;

  summaryTableColumns: any[];
  summaryTableData: any[];
  summaryTable: { columns: any[], rows: any[], currencyCode: string };
  filterButtons: any[];
  activeFilter: number = 0;
  template: TemplateModel;
  request: RequestModel
  requestId: number;
  choosenType: number = 1;
  offers: OfferModel[];
  filteredOffers: OfferModel[];

  reverseAuctionSessionForm: FormGroup;

  displayCreateReverseAuction: boolean;
  sel: any;

  constructor(
    @Inject(REQUEST_SERVICE) private service: IRequestService,
    @Inject(OFFER_SERVICE) private offerService: IOfferService,
    @Inject(TEMPLATE_SERVICE) private templateService: ITemplateService,
    @Inject(REVERSEAUCTION_SERVICE) private reverseAuctionService: IReverseAuctionService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: NotificationHelper,
    private fb: FormBuilder
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

    this.createForm();
    await this.getRequest();
    this.getOfferList();
  }

  async getRequest() {
    this.request = await this.service.getById(this.requestId.toString());
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
      id: offer.id,
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

  async createTable() {

    if (this.offers.length === 0) {
      this.messageService.showError("Karşılaştırma tablosuna eklenebilecek teklif yok")

      return;
    }

    if (this.choosenType === 2 && !this.offers.some(x => x.addedToShortList)) {
      this.messageService.showError("Kısa listeye eklenmiş bir teklif yok")

      return;
    }

    await this.service.createComprasionTable({ requestId: this.request.id, offerType: Number(this.choosenType) });

    this.router.navigate(["/offers/request-selection"]);
  }

  createForm() {
    const control = (defaultValue: any, validators: any[] = []) =>
      this.fb.control(defaultValue, { validators });

    const defautlStartTime = new Date();
    defautlStartTime.setHours(14, 0, 0, 0);

    const defaultEndTime = new Date();
    defaultEndTime.setHours(16, 0, 0, 0);

    this.reverseAuctionSessionForm = this.fb.group({
      sessionDate: control(null, [Validators.required, this.sessionDateValidator]),
      startTime: [defautlStartTime, [Validators.required, this.startTimeValidator.bind(this)]],
      endTime: [defaultEndTime, [Validators.required, this.endTimeValidator.bind(this)]],
      meetLink: control(null, [Validators.required, this.urlValidator.bind(this)]),

      showCompanyNames: [true],
      showAllOffers: [true],
      showOfferRankings: [true],
    });

    this.reverseAuctionSessionForm.markAllAsTouched();

    this.reverseAuctionSessionForm.get('sessionDate')?.valueChanges.subscribe(() => {
      const startTimeControl = this.reverseAuctionSessionForm.get('startTime');
      const endTimeControl = this.reverseAuctionSessionForm.get('endTime');

      startTimeControl?.markAsTouched();
      startTimeControl?.updateValueAndValidity();
      startTimeControl?.markAsDirty();

      endTimeControl?.markAsTouched();
      endTimeControl?.updateValueAndValidity();
      endTimeControl?.markAsDirty();
    });

    this.reverseAuctionSessionForm.get('startTime')?.valueChanges.subscribe(() => {
      const endTimeControl = this.reverseAuctionSessionForm.get('endTime');

      endTimeControl?.markAsTouched();
      endTimeControl?.updateValueAndValidity();
      endTimeControl?.markAsDirty();
    });
  }

  urlValidator(control: AbstractControl): ValidationErrors | null {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    const isValid = urlPattern.test(control.value || '');
    return isValid ? null : { invalidUrl: true };
  }

  sessionDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = control.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugün başlangıcı

    if (selectedDate && new Date(selectedDate) < today) {
      return { sessionDateInvalid: true }; // Geçmiş bir tarih seçilmişse hata
    }
    return null;
  }

  startTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.reverseAuctionSessionForm) return null;

    const sessionDate = this.reverseAuctionSessionForm.get('sessionDate')?.value;
    const startTime = control.value;
    const currentTime = new Date();

    if (sessionDate) {
      const selectedStartDateTime = new Date(sessionDate);
      selectedStartDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

      if (new Date(sessionDate).toDateString() === currentTime.toDateString()) {
        // Bugün için saat kontrolü
        if (selectedStartDateTime <= currentTime) {
          return { startTimeInvalid: true }; // Şu anki zamandan önce seçilmişse hata
        }
      }
    }
    return null;
  }

  endTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.reverseAuctionSessionForm) return null;

    const sessionDate = this.reverseAuctionSessionForm.get('sessionDate')?.value;
    const startTime = this.reverseAuctionSessionForm.get('startTime')?.value;
    const endTime = control.value;

    if (sessionDate && startTime && endTime) {
      const selectedStartDateTime = new Date(sessionDate);
      selectedStartDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

      const selectedEndDateTime = new Date(sessionDate);
      selectedEndDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      if (selectedEndDateTime <= selectedStartDateTime) {
        return { endTimeInvalid: true }; // EndTime, StartTime'dan önce olamaz
      }
    }
    return null;
  }

  offerChange() {
    this.getOfferList();
  }

  allocation() {
    this.router.navigate(["/offers/allocation/" + this.request.id]);
  }

  async saveReverseAuctionSession() {
    if (this.reverseAuctionSessionForm.invalid) {
      this.reverseAuctionSessionForm.markAllAsTouched();

      return;
    }

    const offerIdList = this.offerSelectionComponent.selectedOffers.map(x => x.id);
    const formValue = this.reverseAuctionSessionForm.value;
    const startDateTime = new Date(formValue.sessionDate);
    startDateTime.setHours(formValue.startTime.getHours(), formValue.startTime.getMinutes(), 0, 0);

    const endDateTime = new Date(formValue.sessionDate);
    endDateTime.setHours(formValue.endTime.getHours(), formValue.endTime.getMinutes(), 0, 0);

    const payload = {
      ...formValue,
      requestId: this.requestId,
      offerIdList,
      startTime: startDateTime,
      endTime: endDateTime,
    } as ReverseAuctionModel;

    await this.reverseAuctionService.create(payload)

    this.displayCreateReverseAuction = false;
    this.reverseAuctionSessionForm.reset();

    this.router.navigate(["/offers/request-selection"]);
  }
}
