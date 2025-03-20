import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { AppTableComponent } from "../../shared/table/table.component";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";
import { IBankInfoService } from "src/app/core/services/i.bankInfo.service";
import { BANKINFO_SERVICE } from "src/app/service/bankInfo.service";
import { BankInfoModel } from "src/app/core/domain/bankInfo.model";
import { CurrencyModel } from "src/app/core/domain/currencyParameter.model";
import { ICurrencyParameterService } from "src/app/core/services/i.currencyParameter.service";
import { CURRENCYPARAMETER_SERVICE } from "src/app/service/currencyParameter.service";

@Component({
    templateUrl: "./bank-info.component.html",
    styleUrls: ["./bank-info.component.scss"],
})

export class BankInfoComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    form: FormGroup;
    displayForm: boolean = false;
    selected: boolean;

    cityList: ListItemModel[];
    districtList: ListItemModel[];
    branchList: ListItemModel[];
    filterDistrictList: ListItemModel[];
    currencyOptions: CurrencyModel[] = [];

    filterFields: any;

    @ViewChild(AppTableComponent) table!: AppTableComponent<BankInfoModel>;

    constructor(
        @Inject(BANKINFO_SERVICE) protected service: IBankInfoService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        @Inject(CURRENCYPARAMETER_SERVICE) protected currencyService: ICurrencyParameterService,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {

        this.columns = [
            {
                name: 'bankName',
                label: 'bank'
            },
            {
                name: "branchName",
                label: "branch",
            },
            {
                name: "iban",
                label: "iban",
            },
            {
                name: "currencyName",
                label: "currency",
            },
        ]

        this.actionItems = [
            {
                label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEdit() }
            },
            {
                label: 'delete', icon: 'pi pi-trash', command: () => { this.delete() }
            },
        ];

        this.createForm();
        this.getCityList();
        this.getCurrencyList();

        this.filterFields = [
            { label: 'currency', type: 'select', controlName: 'currencyId' },
            { label: 'city', type: 'select', controlName: 'cityId', relation: 'districtId' },
            { label: 'district', type: 'select', controlName: 'districtId', relation: 'branchId' },
            { label: 'branch', type: 'select', controlName: 'branchId' }
        ];
    }

    createForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, validators);

        this.form = this.fb.group({
            id: control(0),
            iban: control("", [Validators.required]),
            currencyId: control("", [Validators.required]),
            cityId: control("", [Validators.required]),
            districtId: control("", [Validators.required]),
            branchId: control("", [Validators.required]),
        });
    }

    toggleForm() {
        this.displayForm = !this.displayForm;
    }

    handleAdd() {
        this.selected = false;
        this.table.selectedRow = null;
        this.form.reset({ id: 0 });
        this.toggleForm();
    }

    async handleEdit() {
        this.selected = true;
        await this.getDistrictlist(this.table.selectedRow.cityId)
        await this.getBranchList(this.table.selectedRow.districtId)
        this.form.patchValue(this.table.selectedRow);

        this.toggleForm();
    }

    async delete() {
        await this.service.delete(this.table.selectedRow.id);

        await this.table.refresh();
    }

    async onSubmit() {
        if (!this.form.valid)
            return;

        const data = this.form.value as BankInfoModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
    }

    async getCityList() {
        this.cityList = await this.listService.getSelectedItemList("city");

        const field = this.filterFields.find(field => field.controlName === 'cityId');

        if (field) {
            field.options = this.cityList;
        }
    }

    async getDistrictlist(cityId: number) {
        this.districtList = await this.listService.getSelectedItemList("district", { 'cityId': cityId.toString() });
    }

    async getFilterDistrictlist(cityId: number) {
        this.filterDistrictList = await this.listService.getSelectedItemList("district", { 'cityId': cityId.toString() });

        const field = this.filterFields.find(field => field.controlName === 'districtId');

        if (field) {
            field.options = this.filterDistrictList;
        }
    }

    async getBranchList(districtId: number) {
        this.branchList = await this.listService.getSelectedItemList("branch", { 'districtId': districtId.toString() });
    }

    
    async getFilterBranchList(districtId: number) {
        const branchList = await this.listService.getSelectedItemList("branch", { 'districtId': districtId.toString() });

        const field = this.filterFields.find(field => field.controlName === 'branchId');

        if (field) {
            field.options = branchList;
        }
    }

    async getCurrencyList() {
        this.currencyOptions = await this.currencyService.getCurrencyList();

        const field = this.filterFields.find(field => field.controlName === 'currencyId');

        if (field) {
            field.options = this.currencyOptions;
        }
    }

    cityChange({ value }) {
        this.getDistrictlist(value);
    }

    districtChange({ value }) {
        this.getBranchList(value);
    }

    filterCityChange(value) {
        this.getFilterDistrictlist(value);
    }

    filterDistrictChange(value) {
        this.getFilterBranchList(value);
    }

    onSelectChange(event: { controlName: string; value: any }) {
        if (event.controlName === 'cityId') {
            this.filterCityChange(event.value);
        }

        if (event.controlName === 'districtId') {
            this.filterDistrictChange(event.value);
        }
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }
}
