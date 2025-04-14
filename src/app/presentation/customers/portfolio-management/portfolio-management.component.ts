import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { AppTableComponent } from '../../shared/table/table.component';
import { RequestModel } from 'src/app/core/domain/request.model';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { CUSTOMERPORTFOLIO_SERVICE } from 'src/app/service/customerPortfolio.service';
import { ICustomerPortfolioService } from 'src/app/core/services/i.customerPortfolio.service';

@Component({
    selector: "app-portfolio-management",
    templateUrl: "./portfolio-management.component.html",
})

export class PortfolioManagementComponent implements OnInit {
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

    visibleCancellation: boolean;

    filterForm: FormGroup;
    approvalForm: FormGroup;
    choosenApprovalStatus: ApprovalStatus;

    mainCategoryList: ListItemModel[];
    filterSubCategoryList: ListItemModel[];
    filterFields: any;


    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(CUSTOMERPORTFOLIO_SERVICE) protected service: ICustomerPortfolioService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initialActionItems();
        this.initialColumns();
        this.initialOptions();
        this.createFilterForm();
        this.createApprovalForm();

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
                name: 'name',
                label: 'customerFirmTitle'
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
                label: 'supplierPerfManagement', icon: 'pi pi-chart-line', command: () => { this.viewDetail() },
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

    createApprovalForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators });

        this.approvalForm = this.fb.group({
            id: control(null, [Validators.required]),
            status: control(null, [Validators.required]),
            comment: control(null),
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
        this.router.navigate([`/customers/performance-management/${this.table.selectedRow.id}`]);
    }

    async submitApprovalForm() {
        if (this.approvalForm.valid) {
            this.visibleCancellation = false;
            this.approvalForm.reset();
            this.table.refresh();
        }
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

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }

}
