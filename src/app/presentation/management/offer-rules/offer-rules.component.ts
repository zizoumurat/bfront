import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { ICurrencyParameterService } from 'src/app/core/services/i.currencyParameter.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { IOfferLimitService } from 'src/app/core/services/i.offerLimit.service';
import { CURRENCYPARAMETER_SERVICE } from 'src/app/service/currencyParameter.service';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { OFFERLIMIT_SERVICE } from 'src/app/service/offerLimit.service';
import { TableMenuItem } from '../../shared/table/models/TableMenuItem';
import { AppTableComponent } from '../../shared/table/table.component';
import { OfferLimitModel } from 'src/app/core/domain/offerLimit.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';

@Component({
  selector: 'app-offer-rules',
  templateUrl: './offer-rules.component.html',
  styleUrl: './offer-rules.component.scss'
})
export class OfferRulesComponent {
  @ViewChild(AppTableComponent) table!: AppTableComponent<OfferLimitModel>;

  form: FormGroup;
  filterForm: FormGroup;
  searchObject: any;
  currencyOptions: ListItemModel[] = [];
  displayForm: boolean;
  actionItems: TableMenuItem[];
  columns: any[];
  selected: boolean;

  constructor(
    @Inject(LISTITEM_SERVICE) private listService: IListItemService,
    @Inject(OFFERLIMIT_SERVICE) protected service: IOfferLimitService,
    @Inject(CURRENCYPARAMETER_SERVICE) protected currencyService: ICurrencyParameterService,
    private translateService: TranslateService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFilterForm();
    this.createForm();
    this.getOptions();
    this.initializeColumns();
    this.actionItems = [
      {
        label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEdit() }
      },
      {
        label: 'delete', icon: 'pi pi-trash', command: () => { this.delete() }
      },
    ];
  }

  async getOptions() {
    const [currencyOptions] = await Promise.all([
      this.listService.getSelectedItemList("currency")
    ]);

    this.currencyOptions = currencyOptions;
  }

  initializeColumns() {
    this.columns = [
      { name: "spendLimit", label: "Harcama Limiti", type: FormatEnum.currency },
      { name: "minimumOfferCount", label: "Minumum Teklif Adedi" },
      { name: "currencyName", label: "Para Birimi" },
    ];
  }

  createForm() {
    const control = (defaultValue: any, validators: any[] = []) =>
      this.fb.control(defaultValue, { validators, updateOn: 'change' });

    this.form = this.fb.group({
      id: control(0),
      currencyId: ({ value: null, disabled: true }),
      spendLimit: control(null, [Validators.required]),
      minimumOfferCount: control(null, [Validators.required]),
    });
  }

  createFilterForm() {
    const control = (defaultValue: any) =>
      this.fb.control(defaultValue);

    this.filterForm = this.fb.group({
      spendLimitMin: control(null),
      spendLimitMax: control(null),
      offerLimitMin: control(null),
      offerLimitMax: control(null),
    });
  }

  handleAdd() {
    this.selected = false;
    this.table.selectedRow = null;
    this.form.reset({ id: 0 });
    this.toggleForm();
  }

  async handleEdit() {
    this.selected = true;
    this.form.patchValue(this.table.selectedRow);

    this.toggleForm();
  }

  async delete() {
    await this.service.delete(this.table.selectedRow.id);

    await this.table.refresh();
  }

  toggleForm() {
    this.displayForm = !this.displayForm;
  }

  submitFilter() {
    this.searchObject = this.filterForm.value;
  }

  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.submitFilter();
  }

  async onSubmit() {
    if (!this.form.valid)
      return;

    const data = this.form.value as OfferLimitModel;

    data.currencyId = 1;

    if (data.id === 0)
      await this.service.create(data)
    else
      await this.service.update(data);

    this.toggleForm();
    this.form.reset();

    this.table.refresh();
  }
}
