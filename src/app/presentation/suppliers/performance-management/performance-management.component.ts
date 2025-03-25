import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { AppTableComponent } from '../../shared/table/table.component';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { SUPPLIERPORTFOLIO_SERVICE } from 'src/app/service/supplierPortfolio.service';
import { ISupplierPortfolioService } from 'src/app/core/services/i.supplierPortfolio.service';
import { SupplierPortfolioModel } from 'src/app/core/domain/supplierPortfolio.model';
import { SUPPLIERACTION_SERVICE } from 'src/app/service/supplierAction.service';
import { ISupplierActionService } from 'src/app/core/services/i.supplierAction.service';
import { SupplierActionModel, SupplierActionStatusEnum, SupplierActionTypeEnum } from 'src/app/core/domain/supplierAction.model';
import { NonconformityReasonEnum } from 'src/app/core/domain/orderPreparation.model';

@Component({
    selector: "app-performance-management",
    templateUrl: "./performance-management.component.html",
})

export class PerformanceManagementComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { isForApprovalArchive: true };
    totalRecords: number;
    selectedRow: any;
    locationOptions!: ListItemModel[];
    currencyOptions: ListItemModel[];

    visibleCustomerDetailsVisible: boolean = false;
    visibleSetScore: boolean = false;
    visibleCreateAction: boolean = false;

    filterForm: FormGroup;
    approvalForm: FormGroup;
    choosenApprovalStatus: ApprovalStatus;

    mainCategoryList: ListItemModel[];
    filterSubCategoryList: ListItemModel[];
    filterFields: any;

    detail: any;

    valueQuality: number = 0;
    valueCertification: number = 0;
    valueHealth: number = 0;
    valueComplianceEnv: number = 0;
    valueComplianceEth: number = 0;
    valuePerformance: number = 0;
    valueAvg: number = 0;


    actionTypeOptions: ListItemModel[] = [];
    supplierActions: SupplierActionModel[];

    actionForm: FormGroup;

    visibleAction: boolean = false;


    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<SupplierPortfolioModel>;

    constructor(
        @Inject(SUPPLIERPORTFOLIO_SERVICE) protected service: ISupplierPortfolioService,
        @Inject(SUPPLIERACTION_SERVICE) protected actionService: ISupplierActionService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private messageService: NotificationHelper,
        private translateService: TranslateService,
        private fb: FormBuilder
    ) {
        this.actionTypeOptions = Object.keys(NonconformityReasonEnum)
            .filter((key) => isNaN(Number(key)))
            .map((key) => ({
                id: NonconformityReasonEnum[key as keyof typeof NonconformityReasonEnum],
                name: this.translateService.instant(`NonconformityReason.${key}`)
            }));
    }

    ngOnInit(): void {
        this.initialActionItems();
        this.initialColumns();
        this.initialOptions();
        this.createActionForm();
        this.createFilterForm();

        this.filterFields = [
            { label: 'supplierFirmTitle', type: 'text', controlName: 'name' },
            { label: 'mainCategory', type: 'select', controlName: 'mainCategoryId', relation: 'subCategoryId' },
            { label: 'subCategory', type: 'select', controlName: 'subCategoryId' },
            { label: 'selectedSupplier', type: 'select', controlName: 'selectedSupplierId' },
        ];

        this.getMainCategoryList();
    }


    initialColumns() {
        this.columns = [
            {
                name: 'code',
                label: 'supplierSelection',
                type: 'checkbox',
                sortable: false
            },
            {
                name: 'code',
                label: 'supplierCode'
            },
            {
                name: 'name',
                label: 'supplierFirmTitle'
            },
            {
                name: 'city',
                label: 'city'
            },
            {
                name: 'district',
                label: 'district'
            },
            {
                name: 'contact',
                label: 'contactPerson',
            }
        ];
    }

    initialActionItems() {
        this.actionItems = [
            {
                label: 'supplierPerfManagement', icon: 'pi pi-eye', command: () => { this.viewDetail() },
            },
        ];

    }

    async getMainCategoryList() {
        this.mainCategoryList = await this.listService.getSelectedItemList("maincategory");

        const field = this.filterFields.find(field => field.controlName === 'mainCategoryId');

        if (field) {
            field.options = this.mainCategoryList;
        }
    }

    async initialOptions() {
        const [locationOptions, currencyOptions] = await Promise.all([
            this.listService.getSelectedItemList("location"),
            this.listService.getSelectedItemList("currency")
        ]);

        this.locationOptions = locationOptions;
        this.currencyOptions = currencyOptions;
    }

    async getActionList(supplierId: number) {
        this.supplierActions = await this.actionService.getListByCompany(supplierId);
    }

    createFilterForm() {
        const control = (defaultValue: any) =>
            this.fb.control(defaultValue);

        this.filterForm = this.fb.group({
            requestCode: control(""),
            title: control(""),
            locationId: control(""),
            currencyId: control(""),
        });
    }

    createActionForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators, updateOn: 'change' });

        this.actionForm = this.fb.group({
            id: control(0),
            type: control(null, [Validators.required]),
            supplierId: control(null, [Validators.required]),
            subject: control(null, [Validators.required]),
            detail: control(null, [Validators.required]),
            dueDate: control(null, [Validators.required]),
        });
    }

    async loadData(event: LazyLoadEvent) {
        this.lastLazyLoadEvent = event;
        const paginationFilter = new PaginationFilterModel();

        paginationFilter.page = Number(event.first / event.rows);
        paginationFilter.sortBy = event.sortField || "";
        paginationFilter.isSortAscending = event.sortOrder;
        paginationFilter.pageSize = event.rows;

        var result = await this.service.getPaginationList(paginationFilter, this.searchObject);

        this.items = result.items;
        this.totalRecords = result.count;
    }


    viewDetail() {
        var selected = this.table.selectedRow as SupplierPortfolioModel;

        console.log('geldi')


        if (selected.id == 1) {
            this.detail = {
                name: 'Fatih Orman',
                code: 'SUP-20240201-001',
                contact: 'Fatih Çelen',
                bankName: 'Akbank',
                branchName: 'Karatay',
                branchCode: '1234',
                accountNumber: '1234567890',
                iban: 'TR 1234 5678 9012 3456 7890 12',
                taxtAdministration: 'Alaaddin Vergi Dairesi',
                taxNumber: '123456789'
            }
        }
        else {
            this.detail = {
                name: 'Fatih Orman',
                code: 'SUP-20240201-002',
                contact: 'Murat Dere',
                bankName: 'Denizbank',
                branchName: 'Karatay',
                branchCode: '1234',
                accountNumber: '1234567890',
                iban: 'TR 5323 5132 9012 3456 7890 13',
                taxtAdministration: 'Alaaddin Vergi Dairesi',
                taxNumber: '123456785'
            }
        }

        this.visibleCustomerDetailsVisible = true;
    }

    submitFilter() {
        this.searchObject = { isForApprovalArchive: true, ...this.filterForm.value };
    }

    resetFilterForm() {
        this.searchObject = null;
        this.filterForm.reset();
    }

    onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.submitFilter();
    }

    async getFilterSubCategoryList(mainCategoryId: string) {
        this.filterSubCategoryList = await this.listService.getSelectedItemList("subCategory", { mainCategoryId });

        const field = this.filterFields.find(field => field.controlName === 'subCategoryId');

        if (field) {
            field.options = this.filterSubCategoryList;
        }
    }

    onSelectChange(event: { controlName: string; value: any }) {
        if (event.controlName === 'mainCategoryId') {
            this.getFilterSubCategoryList(event.value);
        }
    }

    selectedItemsChanged(selectedItem: any) {
        this.selectedRow = selectedItem;
        this.getActionList(selectedItem.id);
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }

    showSetScore() {
        this.visibleSetScore = true;
    }

    setScore() {
        this.messageService.showSuccess("Puanlama işlemi başarıyla gerçekleştirildi.");
        this.visibleSetScore = false;
    }

    handleCreateAction() {
        this.actionForm.get('supplierId').setValue(this.selectedRow.id);

        this.visibleCreateAction = true;
    }

    getSupplierActionTypeKey(type: number): string {
        return NonconformityReasonEnum[type];
    }

    getSupplierActionStatusKey(status: number): string {
        return SupplierActionStatusEnum[status];
    }

    onSubmit() {
        if (!this.actionForm.valid)
            return;

        const data = this.actionForm.value as SupplierActionModel;

        this.actionService.create(data)
            .then(() => {
                this.visibleCreateAction = false;
                this.getActionList(data.supplierId);
                this.actionForm.reset();
            });
    }
}
