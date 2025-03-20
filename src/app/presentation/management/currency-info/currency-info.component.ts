import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { CurrencyModel, CurrencyParameterModel } from "src/app/core/domain/currencyParameter.model";
import { ICurrencyParameterService } from "src/app/core/services/i.currencyParameter.service";
import { CURRENCYPARAMETER_SERVICE } from "src/app/service/currencyParameter.service";
import { AppTableComponent } from "../../shared/table/table.component";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";
import { Observable, of, map, catchError, tap, forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FormatEnum } from "src/app/core/enums/format.enum";

@Component({
    templateUrl: "./currency-info.component.html",
    styleUrls: ["./currency-info.component.scss"],
})

export class CurrencyInfoComponent implements OnInit {
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

    currencyList: CurrencyModel[];
    districtList: ListItemModel[];
    filterDistrictList: ListItemModel[];

    selectedCurrency: string = "TRY";

    @ViewChild(AppTableComponent) table!: AppTableComponent<CurrencyParameterModel>;

    constructor(
        @Inject(CURRENCYPARAMETER_SERVICE) protected service: ICurrencyParameterService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private http: HttpClient,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {

        this.columns = [
            {
                name: 'currency1Name',
                label: 'Döviz Birimi 1'
            },
            {
                name: "currency2Name",
                label: "Döviz Birimi 2",
            },
            {
                name: "exchangeRate",
                label: "Kur Oranı",
                type: FormatEnum.currency,
            },
            {
                name: "startDate",
                label: "Başlangıç Tarihi",
                type: FormatEnum.date
            },
            {
                name: "expiredDate",
                label: "Bitiş Tarihi",
                type: FormatEnum.date,
            },
            {
                name: "liveCurrency",
                label: "Anlık Kur",
                type: FormatEnum.currency,
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
            { label: 'currency1', type: 'select', controlName: 'currency1Id' },
            { label: 'exchangeRate', type: 'currency', controlName: 'exchangeRate', currency: this.selectedCurrency },
            { label: 'currency2', type: 'select', controlName: 'currency2Id' },
            { label: 'startDate', type: 'date', controlName: 'startDate' },
            { label: 'endDate', type: 'date', controlName: 'endDate' },
        ];

        this.createForm();
        this.getCurrencyList();
    }

    createForm() {
        this.form = this.fb.group({
            id: [0],
            currency1Id: ["", [Validators.required]],
            exchangeRate: ["", [Validators.required]],
            currency2Id: ["", [Validators.required]],
            startDate: ["", [Validators.required]],
            expiredDate: ["", [Validators.required]],
            liveExchange: [{ value: '', disabled: true }]
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

    handleEdit() {
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

        const data = this.form.value as CurrencyParameterModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
    }


    async getCurrencyList() {
        this.currencyList = await this.service.getCurrencyList();

        var currencyFilters = this.filterFields.filter(x => x.type === 'select');

        currencyFilters.forEach(element => {
            element.options = this.currencyList;
        });
    }

    getLiveCurrency() {
        const apiUrl = "https://api.exchangerate-api.com/v4/latest/";

        const base = this.form.get('currency1Id')?.value;
        const target = this.form.get('currency2Id')?.value;

        if (!base || !target) {
            return;
        }

        const baseCurrency = this.currencyList.find(x => x.id == base).code;
        const targetCurrency = this.currencyList.find(x => x.id == target).code;

        if (!baseCurrency || !targetCurrency) {
            return;
        }

        this.http.get<any>(`${apiUrl}${baseCurrency.toUpperCase()}`).pipe(
            map((apiResponse) => apiResponse.rates[targetCurrency.toUpperCase()]),
            tap((rate) => {
                if (rate !== undefined) {
                    this.form.controls['liveExchange'].setValue(rate);
                }
            }),
            catchError((error) => {
                this.form.controls['liveExchange'].setValue(0);
                return of(0);
            })
        ).subscribe();
    }

    enrichCurrencyData = (data: CurrencyParameterModel[]): Observable<CurrencyParameterModel[]> => {
        const apiUrl = 'https://api.exchangerate-api.com/v4/latest/';

        const apiRequests = data.map(row => {
            const base = row.currency1Code;
            const target = row.currency2Code;

            return this.http.get<any>(`${apiUrl}${base.toUpperCase()}`).pipe(
                map(apiResponse => {
                    row.liveCurrency = apiResponse.rates[target.toUpperCase()] || 0;
                    return row;
                })
            );
        });

        return forkJoin(apiRequests);
    };

    onSelectChange(event: { controlName: string; value: any }) {
        if (event.controlName === 'currency2Id') {
            const find = this.currencyList.find(x => x.id == event.value);

            if (find) {
                this.selectedCurrency = find.code;

                var findedFilter = this.filterFields.find(x => x.type === 'currency');
                findedFilter.currency = this.selectedCurrency;
            }
        }
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }
}
