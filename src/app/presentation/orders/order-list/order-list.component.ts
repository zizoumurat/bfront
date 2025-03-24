import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { AppTableComponent } from '../../shared/table/table.component';
import { RequestModel } from 'src/app/core/domain/request.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { IOrderPreparationService } from 'src/app/core/services/i.orderPreparation.service';
import { ORDERPREPARATION_SERVICE } from 'src/app/service/orderPreparationService';
import { OrderListModel, OrderStatusEnum } from 'src/app/core/domain/orderPreparation.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: "app-order-list",
    templateUrl: "./order-list.component.html",
})

export class OrderListComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    columns: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { isForApproval: true };
    totalRecords: number;
    selectedRow: any;
    locationOptions!: ListItemModel[];
    currencyOptions: ListItemModel[];


    visibleCreateOrder: boolean;
    createOrderTableData: any[];

    filterForm: FormGroup;

    currentUser = this.authHelper.getCurrentUser();
    currencyEnum: FormatEnum = FormatEnum.currency;

    visibleOrderList: boolean;
    orderListTableData: any[];

    items: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    count: number = 0;
    loading: boolean = false;
    expandedRows: { [key: number]: boolean } = {};
    subExpandedRows: { [key: number]: boolean } = {};

    visiblePO: boolean;
    documentUrl: SafeResourceUrl | undefined;
    selectedOrder: OrderListModel;

    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(ORDERPREPARATION_SERVICE) protected service: IOrderPreparationService,
        private authHelper: AuthHelper,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.createFilterForm();
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

    createOrder(item) {
        this.selectedRow = item;
        this.visibleCreateOrder = true;

        this.createOrderTableData = this.selectedRow.offerDetailList.map((item: any) => ({
            offerDetailId: item.id,
            productDefinition: item.productDefinition,
            unitPrice: item.unitPrice,
            maxQuantity: item.maxQuantity,
        }));
    }

    showOrderList() {
        this.selectedRow = this.table.selectedRow;
        this.orderListTableData = this.selectedRow.orders;
        this.visibleOrderList = true;
    }

    submitFilter() {
        this.searchObject = { isForApproval: true, ...this.filterForm.value };
    }

    resetFilterForm() {
        this.searchObject = null;
        this.filterForm.reset();
    }

    onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.submitFilter();
    }

    getOrderStatus(status: number): string {
        return OrderStatusEnum[status];
    }

    async loadData(event?: LazyLoadEvent) {
        this.lastLazyLoadEvent = event;
        const paginationFilter = new PaginationFilterModel();

        if (event) {
            paginationFilter.page = Number(event.first / event.rows);
            paginationFilter.sortByMultiName = [event.sortField || "Id"];
            paginationFilter.sortByMultiOrder = [event.sortOrder];
            paginationFilter.pageSize = event.rows;
        }

        var result = await this.service.getPaginationList(paginationFilter, this.searchObject);

        this.items = result.items;
        this.count = result.count;
        this.loading = false;
    }

    toggleRow(item: any) {
        if (this.expandedRows[item.id]) {
            this.expandedRows = {};
        } else {
            this.expandedRows = { [item.id]: true };
        }
    }

    toggleSubRow(order: any) {
        if (this.subExpandedRows[order.id]) {
            this.subExpandedRows = {};
        } else {
            this.subExpandedRows = { [order.id]: true };
        }
    }

    async submitOrder() {
        const orderItems = this.createOrderTableData.map((item: any) => ({
            offerDetailId: item.offerDetailId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productDefinition: item.productDefinition
        }));

        const data = {
            orderPreparationId: this.selectedRow.id,
            orderItems
        };

        await this.service.createOrder(data);

        this.selectedRow = null;
        this.visibleCreateOrder = false;
        this.createOrderTableData = [];
        this.loadData();
    }

    loadDocument(base64Content: string, fileType: string) {
        const objectUrl = `data:${fileType};base64,${base64Content}`;
        this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);

    }

    openPO(item: any) {
        this.selectedOrder = item;
        this.documentUrl = null;
        this.loadDocument(item.documentUrl, "application/pdf");
        this.visiblePO = true;
    }
}
