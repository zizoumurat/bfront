import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { AppTableComponent } from '../../shared/table/table.component';
import { RequestModel } from 'src/app/core/domain/request.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { IOrderPreparationService } from 'src/app/core/services/i.orderPreparation.service';
import { ORDERPREPARATION_SERVICE } from 'src/app/service/orderPreparationService';
import { NonconformityReasonEnum, OrderStatusEnum } from 'src/app/core/domain/orderPreparation.model';
import { ORDER_SERVICE } from 'src/app/service/orderService';
import { IOrderService } from 'src/app/core/services/i.order.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-order-archive",
    templateUrl: "./order-archive.component.html",
})

export class OrderArchiveComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    columns: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { status: OrderStatusEnum.OrderPending };
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

    filterButtons: any[];
    activeFilter: number = 0;

    actionForm: FormGroup;
    visibleReportInc: boolean = false;
    nonconformityStatusOptions: ListItemModel[] = [];

    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(ORDER_SERVICE) protected service: IOrderService,
        private authHelper: AuthHelper,
        private fb: FormBuilder,
        private translateService: TranslateService,
        private confirmationService: ConfirmationService,
    ) {

        this.nonconformityStatusOptions = Object.keys(NonconformityReasonEnum)
            .filter((key) => isNaN(Number(key))) // Sayısal değerleri filtrele
            .map((key) => ({
                id: NonconformityReasonEnum[key as keyof typeof NonconformityReasonEnum],
                name: this.translateService.instant(`NonconformityReason.${key}`)
            }));
    }

    createActionForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators, updateOn: 'change' });

        this.actionForm = this.fb.group({
            id: control(0),
            type: control(null, [Validators.required]),
            subject: control(null, [Validators.required]),
            detail: control(null, [Validators.required]),
            dueDate: control(null, [Validators.required]),

        });
    }

    ngOnInit(): void {
        this.createFilterForm();
        this.createActionForm();

        this.filterButtons = ['Açık Siparişler', 'Teslim Alınan Siparişler', 'İptal Edilen Siparişler', 'Uygunsuzluk Bildirimleri']
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

    applyFilter(index: number) {
        this.activeFilter = index;

        if (index === 0) {
            this.searchObject = { status: OrderStatusEnum.OrderPending };
        }

        if (index === 1) {
            this.searchObject = { status: OrderStatusEnum.Delivered };
        }

        if (index === 2) {
            this.searchObject = { status: OrderStatusEnum.OrderCancelled };
        }

        if (index === 3) {
            this.searchObject = { status: OrderStatusEnum.NonconformityReported };
        }

        this.loadData();
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

    handleInc({ id }) {
        this.actionForm.patchValue({ id });

        this.visibleReportInc = true;
    }

    async onSubmit() {
        if (!this.actionForm.valid)
            return;

        const data = this.actionForm.value;

        await this.service.setNonconformity(data)

        this.actionForm.reset();
        this.visibleReportInc = false;

        this.loadData();
    }

    async cancelOrder({ id }) {
        this.confirmationService.confirm({
            key: 'deleteConfirm',
            header: 'Emin misiniz?',
            message: 'Siparişi İptal Etmek İstediğinizden Emin misiniz?',
            accept: async () => {
                await this.service.cancelOrder(id);
                this.loadData();
            },
            reject: () => {

            }
        });
    }
}
