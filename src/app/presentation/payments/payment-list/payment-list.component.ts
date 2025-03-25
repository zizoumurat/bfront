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
import { NonconformityReasonEnum, OrderStatusEnum } from 'src/app/core/domain/orderPreparation.model';
import { ORDER_SERVICE } from 'src/app/service/orderService';
import { IOrderService } from 'src/app/core/services/i.order.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-payment-list",
    templateUrl: "./payment-list.component.html",
})

export class PaymentListComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { status: OrderStatusEnum.OrderPending };
    totalRecords: number;
    filterForm: FormGroup;
    currencyEnum: FormatEnum = FormatEnum.currency;

    items: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    count: number = 0;
    loading: boolean = false;
    selectedOrders: any[] = [];
    selectedCurrency: string = 'TRY';

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
        this.searchObject = { status: OrderStatusEnum.Delivered };

        this.filterButtons = ['Tüm Tedarikçi Faturaları', 'Vadesi Geçen Tedarikçi Faturaları', 'Vadesi Gelmemiş Tedarikçi Faturaları']
    }

    submitFilter() {
        this.searchObject = { isForApproval: true, ...this.filterForm.value };
    }

    resetFilterForm() {
        this.searchObject = null;
        this.filterForm.reset();
    }

    applyFilter(index: number) {
        this.activeFilter = index;

        if (index === 0) {
            this.searchObject = { invoiceDate: null, ...this.searchObject };
        }

        if (index === 1) {
            this.searchObject = { invoiceDate: false, ...this.searchObject };
        }

        if (index === 2) {
            this.searchObject = { status: OrderStatusEnum.OrderCancelled };
        }


        this.loadData();
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

    getSelectedTotal(): number {
        if (!this.selectedOrders || this.selectedOrders.length === 0) {
            return 0;
        }
        
        // Seçilen siparişlerin toplam fiyatını hesapla
        this.selectedCurrency = this.selectedOrders[0]?.orderPreparation?.currencyCode || 'TRY';
        return this.selectedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    }

    createPaymentList() {

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
}
