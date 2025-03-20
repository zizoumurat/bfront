import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { ICurrencyParameterService } from 'src/app/core/services/i.currencyParameter.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { CURRENCYPARAMETER_SERVICE } from 'src/app/service/currencyParameter.service';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { TableMenuItem } from '../../shared/table/models/TableMenuItem';
import { AppTableComponent } from '../../shared/table/table.component';
import { ApprovalChainModel } from 'src/app/core/domain/approvalChain.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { APPROVALCHAIN_SERVICE } from 'src/app/service/approvalChain.service';
import { IApprovalChainService } from 'src/app/core/services/i.approvalChain.service';
import { USER_SERVICE } from 'src/app/service/user.service';
import { IUserService } from 'src/app/core/services/i.user.service';
import { CurrencyModel } from 'src/app/core/domain/currencyParameter.model';

@Component({
  selector: 'app-apply-chain',
  templateUrl: './apply-chain.component.html',
})
export class ApplyChainComponent {
  @ViewChild(AppTableComponent) table!: AppTableComponent<ApprovalChainModel>;

  form: FormGroup;
  filterForm: FormGroup;
  searchObject: any;
  currencyOptions: CurrencyModel[] = [];
  userOptions: ListItemModel[] = [];
  displayForm: boolean;
  actionItems: TableMenuItem[];
  columns: any[];
  selected: boolean;
  filterFields: any;

  selectedCurrency = "TRY";

  constructor(
    @Inject(LISTITEM_SERVICE) private listService: IListItemService,
    @Inject(USER_SERVICE) private userService: IUserService,
    @Inject(APPROVALCHAIN_SERVICE) protected service: IApprovalChainService,
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

    this.filterFields = [
      { label: 'user', type: 'select', controlName: 'userId' },
      { label: 'currency', type: 'select', controlName: 'currencyId' },
      { label: 'spendLimitMin', type: 'currency', controlName: 'spendLimitMin', currency: this.selectedCurrency },
      { label: 'spendLimitMax', type: 'currency', controlName: 'spendLimitMax', currency: this.selectedCurrency }
    ];
  }

  async getOptions() {
    const [currencyOptions, userList] = await Promise.all([
      this.currencyService.getCurrencyList(),
      this.userService.getAll()
    ]);

    this.currencyOptions = currencyOptions;
    this.userOptions = userList.map(x => ({ name: `${x.name} ${x.surname}`, id: x.id }))

    const userField = this.filterFields.find(field => field.controlName === 'userId');

    if (userField) {
      userField.options = this.userOptions;
    }

    const currencyField = this.filterFields.find(field => field.controlName === 'currencyId');

    if (currencyField) {
      currencyField.options = this.currencyOptions;
    }
  }

  initializeColumns() {
    this.columns = [
      { name: "ownerUserList", label: this.translateService.instant('user'), type: FormatEnum.userList },
      { name: "spendLimit", label: this.translateService.instant('spendLimit'), type: FormatEnum.currency },
      { name: "currencyName", label: this.translateService.instant('currency') },
    ];
  }

  createForm() {
    const control = (defaultValue: any, validators: any[] = []) =>
      this.fb.control(defaultValue, { validators, updateOn: 'change' });

    this.form = this.fb.group({
      id: control(0),
      currencyId: control(null, [Validators.required]),
      spendLimit: control(null, [Validators.required]),
      userIdList: control(null, [Validators.required]),
    });
  }

  createFilterForm() {
    const control = (defaultValue: any) =>
      this.fb.control(defaultValue);

    this.filterForm = this.fb.group({
      userId: control(null),
      currencyId: control(null),
      spendLimitMin: control(null),
      spendLimitMax: control(null),
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

    const data = this.form.value as ApprovalChainModel;

    if (data.id === 0)
      await this.service.create(data)
    else
      await this.service.update(data);

    this.toggleForm();
    this.form.reset();

    this.table.refresh();
  }

  onSelectChange(event: { controlName: string; value: any }) {
    if (event.controlName === 'currencyId') {
      const find = this.currencyOptions.find(x => x.id == event.value);

      if (find)
        this.selectedCurrency = find.code;

      var currencyFilters = this.filterFields.filter(x => x.type === 'currency');

      currencyFilters.forEach(element => {
        element.currency = this.selectedCurrency;
      });
    }
  }

  updateSearchObject(updatedObject: any) {
    this.searchObject = updatedObject;
  }
}
