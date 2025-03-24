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
import { NonconformityReasonEnum, OrderListModel, OrderStatusEnum } from 'src/app/core/domain/orderPreparation.model';
import { ORDER_SERVICE } from 'src/app/service/orderService';
import { IOrderService } from 'src/app/core/services/i.order.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: "app-order-list-supplier",
    templateUrl: "./order-list-supplier.component.html",
})

export class OrderListSupplierComponent implements OnInit {
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
    statusOptions: ListItemModel[] = [];

    OrderStatusEnum = OrderStatusEnum;

    visiblePO: boolean;
    documentUrl: SafeResourceUrl | undefined;
    selectedOrder: OrderListModel;

    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(ORDER_SERVICE) protected service: IOrderService,
        private authHelper: AuthHelper,
        private fb: FormBuilder,
        private translateService: TranslateService,
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer
    ) {

        this.statusOptions = [
            {
                id: OrderStatusEnum.InProduction,
                name: "Sipariş Üretim Aşamasında"
            },
            {
                id: OrderStatusEnum.InShipment,
                name: "Sipariş Sevk Aşamasında"
            },
            {
                id: OrderStatusEnum.Shipped,
                name: "Sipariş Sevk Edildi"
            },
        ]
    }

    createActionForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators, updateOn: 'change' });

        this.actionForm = this.fb.group({
            id: control(0),
            type: control(null, [Validators.required]),
            invoiceNumber: control(''),
            waybillNumber: control(''),

        });

        this.actionForm.get('type')?.valueChanges.subscribe(value => {
            if (value === OrderStatusEnum.Shipped) {
                this.actionForm.get('invoiceNumber')?.setValidators(Validators.required);
                this.actionForm.get('waybillNumber')?.setValidators(Validators.required);
            } else {
                this.actionForm.get('invoiceNumber')?.clearValidators();
                this.actionForm.get('waybillNumber')?.clearValidators();
            }
            this.actionForm.get('invoiceNumber')?.updateValueAndValidity();
            this.actionForm.get('waybillNumber')?.updateValueAndValidity();
        });
    }

    ngOnInit(): void {
        this.createFilterForm();
        this.createActionForm();

        this.filterButtons = ['Açık Siparişler', 'Teslim Edilen Siparişler', 'İptal Edilen Siparişler', 'Uygunsuzluk Bildirimleri']
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

        await this.service.changeOrderStatus(data)

        this.actionForm.reset();
        this.visibleReportInc = false;

        this.loadData();
    }

    async received({ id }) {
        this.confirmationService.confirm({
            key: 'deleteConfirm',
            header: 'Emin misiniz?',
            message: 'Siparişi Teslim Alındı Statüsüne Almak İstediğinize Emin Misiniz?',
            accept: async () => {
                await this.service.deliveredOrder(id);
                this.loadData();
            },
            reject: () => {

            }
        });
    }


    loadDocument(base64Content: string, fileType: string) {
        const objectUrl = `data:${fileType};base64,${base64Content}`;
        this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    }

    openPO(item: any) {
        console.log(item);
        this.selectedOrder = item;
        this.documentUrl = null;
        this.loadDocument(item.documentUrl, "application/pdf");
        this.visiblePO = true;
    }
}
