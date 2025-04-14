import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoryModel } from 'src/app/core/domain/category.model';
import { CompanyRequestGroupModel } from 'src/app/core/domain/companyRequestGroup.model';
import { CompanySubCategoryModel } from 'src/app/core/domain/companySubCategory.model';
import { ExchangeRateModel } from 'src/app/core/domain/currencyParameter.model';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { IBudgetService } from 'src/app/core/services/i.budget.service';
import { ICategoryService } from 'src/app/core/services/i.category.service';
import { ICompanyRequestGroupService } from 'src/app/core/services/i.companyRequestGroup.service';
import { ICompanySubCategoryService } from 'src/app/core/services/i.companySubCategory.service';
import { ICurrencyParameterService } from 'src/app/core/services/i.currencyParameter.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { BUDGET_SERVICE } from 'src/app/service/budget.service';
import { CATEGORY_SERVICE } from 'src/app/service/category.service';
import { COMPANYREQUESTGROUP_SERVICE } from 'src/app/service/companyRequestGroup.service';
import { COMPANYSUBCATEGORY_SERVICE } from 'src/app/service/companySubCategory.service';
import { CURRENCYPARAMETER_SERVICE } from 'src/app/service/currencyParameter.service';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  styleUrl: './request-info.component.scss'
})

export class RequestInfoComponent {

  @Input() formData: {};
  @Input() findedCategory: CategoryModel;
  @Input() viewMode: boolean;
  @Input() completeMode: boolean;
  @Input() channelType: number;

  requestForm: FormGroup;
  budgetInclusionOptions: any[];
  channelOptions: ListItemModel[];
  locationOptions: ListItemModel[];
  currencyOptions: ListItemModel[];
  budgetOptions: ListItemModel[];
  mainCategoryOptions: ListItemModel[];
  subCategoryOptions: ListItemModel[];
  companySubCategoryList: CompanySubCategoryModel[];
  requestGroupOptions: ListItemModel[];
  companyRequestGroupList: CompanyRequestGroupModel[];
  showCustomSubject: boolean = false;

  budgetList: any[];

  exchangeRates: ExchangeRateModel[];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    @Inject(LISTITEM_SERVICE) private listService: IListItemService,
    @Inject(CURRENCYPARAMETER_SERVICE) private currencyService: ICurrencyParameterService,
    @Inject(BUDGET_SERVICE) private budgetService: IBudgetService,
    @Inject(CATEGORY_SERVICE) private categoryService: ICategoryService,
    @Inject(COMPANYSUBCATEGORY_SERVICE) protected companySubCategoryService: ICompanySubCategoryService,
    @Inject(COMPANYREQUESTGROUP_SERVICE) protected companyRequestGroupService: ICompanyRequestGroupService,
    private cdr: ChangeDetectorRef,
    private messageService: NotificationHelper) { }

  async ngOnInit() {
    await this.setOptions();
    this.createForm();
    this.requestForm.get('estimatedSupplyDate').disable();
    this.requestForm.get('collectionChannel').disable();

    if (this.viewMode)
      this.requestForm.disable();

    if (this.completeMode) {
      this.requestForm.get('estimatedSupplyDate').enable();

      if (this.channelType === 1) {
        this.channelOptions = this.channelOptions.filter(x => x.id === 1);
        this.requestForm.get('collectionChannel').setValue(1);
      }

      this.requestForm.get('collectionChannel').enable();
    }
  }

  createForm() {
    const control = (defaultValue: any, validators: any[] = []) =>
      this.fb.control(defaultValue, { validators });

    this.requestForm = this.fb.group({
      id: control(0),
      title: control(null, [Validators.required]),
      reason: control(null, [Validators.required]),
      amount: control(null, [Validators.required]),
      budgetInclusionStatus: control(true, [Validators.required]),
      estimatedSupplyDate: control(null, [Validators.required]),
      requestedSupplyDate: control(null, [Validators.required]),
      currencyId: control(null, [Validators.required]),
      categoryId: control(null, [Validators.required]),
      collectionChannel: control(null, [Validators.required]),
      budgetId: control(null, [Validators.required]),
      mainCategoryId: control(null, [Validators.required]),
      subCategoryId: control(null, [Validators.required]),
      requestGroupId: control(null, [Validators.required]),
    });

    this.requestForm.get('budgetId')?.valueChanges.subscribe((newValue) => {
      this.budgetChanged(newValue);
    });

    this.requestForm.get('mainCategoryId')?.valueChanges.subscribe((newValue) => {
      this.mainCategoryChange(newValue);
    });

    this.requestForm.get('subCategoryId')?.valueChanges.subscribe((newValue) => {
      this.subCategoryChange(newValue);
    });

    if (this.formData) {
      this.requestForm.patchValue(this.formData)
    }
  }

  async setOptions() {

    await this.getBudgetList();
    await this.getMainCategoryList();

    this.locationOptions = await this.listService.getSelectedItemList("location");
    this.currencyOptions = await this.listService.getSelectedItemList("currency");

    this.budgetInclusionOptions = [
      { label: this.translateService.instant('inBudget'), value: true },
      { label: this.translateService.instant("outBudget"), value: false }
    ];

    this.channelOptions = [
      { name: this.translateService.instant('companySupplierPortfolio'), id: 1 },
      { name: this.translateService.instant('buyersoftSupplierDatabase'), id: 2 },
    ];
  }

  async getBudgetList() {
    const result = await this.budgetService.getAvailableBudgetList();
    this.budgetList = result;
    const options = result.map(x => ({ id: x.id, name: x.budgetTitle }) as ListItemModel);

    this.budgetOptions = [
      { id: 0, name: this.translateService.instant("createNewTitle") },
      ...options,
    ];
  }

  async getCurrencyList() {
    this.currencyOptions = await this.currencyService.getCurrencyList();
  }

  async getMainCategoryList() {
    this.mainCategoryOptions = await this.listService.getSelectedItemList("maincategory");
  }

  async getSubCategoryList(mainCategoryId: string) {
    this.subCategoryOptions = await this.listService.getSelectedItemList("subCategory", { mainCategoryId });
  }

  async getCompanySubCategoryList(mainCategoryId: number) {
    this.companySubCategoryList = await this.companySubCategoryService.getList(mainCategoryId);
  }

  async getRequestGroupList(subCategoryId: string) {
    this.requestGroupOptions = await this.listService.getSelectedItemList("requestgroup", { subCategoryId });
  }

  async getCompanyRequestGroupList(subCategoryId: number) {
    this.companyRequestGroupList = await this.companyRequestGroupService.getList(subCategoryId);
  }

  async findCategory(): Promise<boolean> {
    const mainCategoryId = this.requestForm.get('mainCategoryId').value;
    const subCategoryId = this.requestForm.get('subCategoryId').value;
    const requestGroupId = this.requestForm.get('requestGroupId').value;
    if (!mainCategoryId || !subCategoryId || !requestGroupId)
      return false;

    this.findedCategory = await this.categoryService.getCategoryId({ mainCategoryId, subCategoryId, requestGroupId });

    if (this.findedCategory) {
      this.requestForm.get('categoryId').setValue(this.findedCategory.id);

      return true;
    }
    else {
      return false;
    }
  }

  async budgetChanged(value): Promise<void> {
    this.showCustomSubject = value === 0;


    const selectedBudget = this.budgetList.find((b) => b.id === value);

    this.setBudgetInclusionStatus(!this.showCustomSubject);
    this.setTitleField(this.showCustomSubject);


    if (this.showCustomSubject) {
      const amountControl = this.requestForm.get("amount");
      amountControl.setValidators([Validators.required]);
      amountControl.updateValueAndValidity();
      this.requestForm.get("currencyId").setValue(null);
      this.requestForm.get("currencyId").enable();

      return;
    };

    if (!selectedBudget) return;

    await this.updateExchangeRates(selectedBudget.currencyId);
    this.updateFormValuesForSelectedBudget(selectedBudget);
  }

  private setBudgetInclusionStatus(status: boolean): void {
    this.requestForm.get("budgetInclusionStatus").setValue(status);
  }

  private setTitleField(enable: boolean): void {
    const titleControl = this.requestForm.get("title");
    if (enable) {
      titleControl.enable();
    }
  }

  private async updateExchangeRates(currencyId: number): Promise<void> {
    this.exchangeRates = await this.currencyService.getCurrencyExchangeRates(currencyId);
  }

  private updateFormValuesForSelectedBudget(budget): void {
    const { budgetTitle, currencyId, availableLimit, id } = budget;

    this.requestForm.get("title").setValue(budgetTitle);
    this.requestForm.get("title").disable();
    this.requestForm.get("currencyId").setValue(currencyId);
    this.requestForm.get("currencyId").disable();

    const amountControl = this.requestForm.get("amount");
    amountControl.setValidators([Validators.required, Validators.max(availableLimit)]);
    amountControl.updateValueAndValidity();
  }

  mainCategoryChange(value) {
    this.getSubCategoryList(value);
    this.getCompanySubCategoryList(value);
  }

  subCategoryChange(value) {
    this.getRequestGroupList(value);
    this.getCompanyRequestGroupList(value);
  }

  async checkFormData(): Promise<boolean> {
    const categoryAvailable = await this.findCategory();

    if (!categoryAvailable) {
      this.messageService.showError("Seçili talep grubu için kategori ayarı yapılmamış!")
      return false;
    }

    this.validateAllFormFields(this.requestForm);

    if (!this.isFormValid()) {
      return false;
    }

    if (this.requestForm.get('budgetId').value && this.exchangeRates && this.exchangeRates.length < 2) {

      this.messageService.showError(this.translateService.instant("insufficientExchangeRateInfo"));

      return false;
    }

    return true;
  }

  get requestGroupName(): string {
    const finded = this.companyRequestGroupList.find(x => x.id === this.requestForm.get('requestGroupId').value)

    return finded.name;
  }

  isFormValid() {
    return this.requestForm.valid;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        if (control.invalid)
          control.markAsTouched({ onlySelf: true });
      }
    });
  }

  getInvalidControlsCount(): number {
    return Object.values(this.requestForm.controls).filter(control => control.invalid).length;
  }
}
