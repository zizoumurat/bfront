import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RequestInfoComponent } from './components/request-info/request-info.component';
import { CategoryModel } from 'src/app/core/domain/category.model';
import { RequestTemplateComponent } from './components/request-template/request-template.component';
import { REQUEST_SERVICE } from 'src/app/service/request.service';
import { IRequestService } from 'src/app/core/services/i.request.service';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestModel } from 'src/app/core/domain/request.model';
import { CATEGORY_SERVICE } from 'src/app/service/category.service';
import { ICategoryService } from 'src/app/core/services/i.category.service';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { SUPPLIER_SERVICE } from 'src/app/service/supplier.service';
import { ISupplierService } from 'src/app/core/services/i.supplier.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.scss'
})
export class CreateRequestComponent implements OnInit {
  @ViewChild(RequestInfoComponent) requestInfoComponent!: RequestInfoComponent;
  @ViewChild(RequestTemplateComponent) requestTemplateComponent!: RequestTemplateComponent;

  constructor(
    @Inject(REQUEST_SERVICE) private service: IRequestService,
    @Inject(SUPPLIER_SERVICE) private supplierService: ISupplierService,
    @Inject(LISTITEM_SERVICE) private listItemService: IListItemService,
    @Inject(CATEGORY_SERVICE) private categoryService: ICategoryService,
    private messageService: NotificationHelper,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  step: number = 1;
  stepItems: MenuItem[];
  requestInfo: any;
  requestTemplate: any;
  category: CategoryModel;

  requestId: number;
  request: RequestModel;
  viewMode: boolean;
  completeMode: boolean;
  channelType: number;
  fetched: boolean = false;

  displayStartModal = false;
  cityOptions: ListItemModel[];

  templateName: string;
  requestGroupName: string;
  cityId: number;

  findedSuppliers: any[];
  selectedSuppliers: any[];

  async ngOnInit(): Promise<void> {
    this.fetched = false;
    this.setStepItems();
    this.route.paramMap.subscribe(async params => {
      if (params.get('id')) {
        this.requestId = Number(params.get('id'));
        this.request = await this.service.getById(this.requestId.toString());
        const { mainCategoryId, subCategoryId, requestGroupId } = this.request;
        this.category = await this.categoryService.getCategoryId({ mainCategoryId, subCategoryId, requestGroupId })
        this.requestInfo = { ...this.request };
        this.requestTemplate = { ...this.request };
        this.step = 3;
      }

      if (params.get('mode') === 'view') {
        this.viewMode = true;
        this.step = 3;
      }

      if (params.get('mode') === 'complete') {
        if (!params.get('channelType')) {
          this.messageService.showError('Hatalı istek')
        }

        this.channelType = Number(params.get('channelType'));
        this.completeMode = true;
        this.step = 3;
      }

      this.cdr.detectChanges();
    });

    this.fetched = true;

    this.cityOptions = await this.listItemService.getSelectedItemList("city");
  }

  setStepItems() {
    this.stepItems = [
      {
        label: 'Talep Temel Bilgileri',
      },
      {
        label: 'Teklif Toplama Şablonu Oluştur',
      },
      {
        label: 'Satın Alma Talebini Tamamla',
      }
    ];
  }

  async goToStep(stepNumber: number) {
    if (stepNumber < this.step)
      this.step = stepNumber;

    if (this.step == 1) {
      if (!this.viewMode) {
        const formIsValid = await this.requestInfoComponent?.checkFormData();

        if (!formIsValid) return;
        this.requestInfo = this.requestInfoComponent.requestForm.getRawValue();
        this.category = this.requestInfoComponent.findedCategory;
      }

    }

    if (this.step == 2) {
      if (!this.viewMode) {
        const formIsValid = await this.requestTemplateComponent?.checkFormData();
        if (!formIsValid) return;
      }

      this.requestTemplate = this.requestTemplateComponent.templateForm.getRawValue();
    }

    this.step = stepNumber;
  }

  async submitRequest() {
    const infoFormIsValid = await this.requestInfoComponent?.checkFormData();
    const templateFormIsValid = await this.requestTemplateComponent?.checkFormData();

    if (!infoFormIsValid || !templateFormIsValid)
      return;

    this.requestInfo = this.requestInfoComponent.requestForm.getRawValue();
    this.requestTemplate = this.requestTemplateComponent.templateForm.getRawValue();

    const data = { ...this.requestInfo, ...this.requestTemplate };

    if (this.request && this.request.id > 0)
      await this.service.update(data);
    else
      await this.service.create(data);

    this.router.navigate(["/requests/list"]);
  }

  async findSuppliers() {
    const list = await this.supplierService.getListByCategory({ categoryId: this.requestInfo.requestGroupId, channelType: this.requestInfo.collectionChannel, cityId: this.cityId });

    this.findedSuppliers = list;
  }

  async startBidCollectionHandle() {
    delete this.cityId;

    const infoFormIsValid = await this.requestInfoComponent?.checkFormData();
    const templateFormIsValid = await this.requestTemplateComponent?.checkFormData();

    if (!infoFormIsValid || !templateFormIsValid)
      return;

    this.requestInfo = this.requestInfoComponent.requestForm.getRawValue();
    this.requestTemplate = this.requestTemplateComponent.templateForm.getRawValue();

    this.requestGroupName = this.requestInfoComponent.requestGroupName;
    this.templateName = this.requestTemplateComponent.selectedTemplateName;

    this.displayStartModal = true;
  }

  async startBidCollenction() {
    const data = {
      request: { id: this.request.id, ...this.requestInfo, ...this.requestTemplate },
      providerIdList: this.selectedSuppliers.map(x => x.id),
    }

    await this.service.startBidCollection(data);

    this.router.navigate(["/requests/list"]);
  }
}

