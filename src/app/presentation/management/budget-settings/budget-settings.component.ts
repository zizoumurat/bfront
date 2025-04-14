import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { BudgetModel } from "src/app/core/domain/budget.model";
import { IBudgetService } from "src/app/core/services/i.budget.service";
import { BUDGET_SERVICE } from "src/app/service/budget.service";
import { AppTableComponent } from "../../shared/table/table.component";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";
import { FormatEnum } from "src/app/core/enums/format.enum";
import { CurrencyModel } from "src/app/core/domain/currencyParameter.model";
import { ICurrencyParameterService } from "src/app/core/services/i.currencyParameter.service";
import { CURRENCYPARAMETER_SERVICE } from "src/app/service/currencyParameter.service";

@Component({
    templateUrl: "./budget-settings.component.html",
    styleUrls: ["./budget-settings.component.scss"],
})

export class BudgetSettingsComponent implements OnInit {

    columns: any[];
    items: any[];
    filterFields: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    form: FormGroup;
    displayForm: boolean = false;
    selected: boolean;

    departmentList: ListItemModel[];
    currencyList: CurrencyModel[];
    selectedCurrency: string = "TRY";

    @ViewChild(AppTableComponent) table!: AppTableComponent<BudgetModel>;

    constructor(
        @Inject(BUDGET_SERVICE) protected service: IBudgetService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        @Inject(CURRENCYPARAMETER_SERVICE) protected currencyService: ICurrencyParameterService,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {

        this.columns = [
            {
                name: "departmentName",
                label: "departmentName",
            },
            {
                name: "budgetTitle",
                label: "budgetTitle",
            },
            {
                name: "currencyName",
                label: "currency",
            },
            {
                name: "budgetLimit",
                label: "budgetLimit",
            },
            {
                name: "startDate",
                label: "startDate",
                type: FormatEnum.date
            },
            {
                name: "endDate",
                label: "endDate",
                type: FormatEnum.date
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

        this.filterFields = [
            { label: 'departmentName', type: 'select', controlName: 'departmentId' },
            { label: 'budgetTitle', type: 'text', controlName: 'budgetTitle' },
            { label: 'currency', type: 'select', controlName: 'currencyId' },
            { label: 'budgetLimitMin', type: 'currency', controlName: 'budgetLimitMin', currency: 'TRY' },
            { label: 'budgetLimitMax', type: 'currency', controlName: 'budgetLimitMax', currency: 'TRY' },
            { label: 'startDate', type: 'date', controlName: 'startDate' },
            { label: 'endDate', type: 'date', controlName: 'endDate' },
        ];

        this.createForm();
        this.getDepartmentList();
        this.getCurrencyList();
    }

    createForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, validators);

        this.form = this.fb.group({
            id: control(0),
            budgetTitle: control("", [Validators.required]),
            departmentId: control("", [Validators.required]),
            currencyId: control("", [Validators.required]),
            budgetLimit: control("", [Validators.required]),
            startDate: control("", [Validators.required]),
            endDate: control("", [Validators.required]),
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

        const data = this.form.value as BudgetModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
    }

    async getDepartmentList() {
        this.departmentList = await this.listService.getSelectedItemList("department");

        const field = this.filterFields.find(field => field.controlName === 'departmentId');

        if (field) {
            field.options = this.departmentList;
        }
    }

    async getCurrencyList() {
        this.currencyList = await this.currencyService.getCurrencyList();

        const field = this.filterFields.find(field => field.controlName === 'currencyId');

        if (field) {
            field.options = this.currencyList;
        }
    }

    currencyChange({ value }) {
        const find = this.currencyList.find(x => x.id == value);

        if (find)
            this.selectedCurrency = find.code;
    }

    onSelectChange(event: { controlName: string; value: any }) {
        if (event.controlName === 'currencyId') {
            const find = this.currencyList.find(x => x.id == event.value);

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
