import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { AppTableComponent } from '../../shared/table/table.component';
import { RequestModel } from 'src/app/core/domain/request.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAYMETNLIST_SERVICE } from 'src/app/service/paymentList.service';
import { IPaymentListService } from 'src/app/core/services/i.paymentList.service';

@Component({
    selector: "app-payments-instructions",
    templateUrl: "./payments-instructions.component.html"
})

export class PaymentsInstructionsComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    columns: any[];
    summaryColumns: any[] = [];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { status: 2 };
    totalRecords: number;
    selectedRow: any;

    visibleCancellation: boolean;

    filterForm: FormGroup;
    approvalForm: FormGroup;
    choosenApprovalStatus: ApprovalStatus;

    currentUser = this.authHelper.getCurrentUser();
    visibleDetails: boolean = false;

    selectedOrderItems: any[];


    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(PAYMETNLIST_SERVICE) protected service: IPaymentListService,
        private authHelper: AuthHelper,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initialActionItems();
        this.initialColumns();
    }

    initialColumns() {
        this.columns = [
            {
                name: 'paymentListCode',
                label: 'paymentListCode'
            },
            {
                name: 'subject',
                label: 'subject'
            },
            {
                name: 'approvalUsers',
                label: 'approvals',
                type: FormatEnum.approvals
            },
            {
                name: 'totalPrice',
                label: 'contractPrice',
                type: FormatEnum.currency
            },
        ];

        this.summaryColumns = [
            {
                name: 'totalPrice',
                label: 'contractPrice',
                type: FormatEnum.currency
            },
        ]
    }

    initialActionItems() {
        this.actionItems = [
            {
                label: "details",
                icon: "pi pi-search",
                class: "primary",
                command: () => this.viewDetails(),
            },
        ];

    }

    viewDetails() {
        this.selectedRow = this.table.selectedRow;

        if (!this.selectedRow || !this.selectedRow.orders) {
            console.error("selectedRow veya orders bulunamadı!");
            return;
        }

        this.selectedOrderItems = this.selectedRow.orders
            .filter(order => order.orderItems)
            .flatMap(order => order.orderItems || []);

        this.visibleDetails = true;
    }

    submitFilter() {
        this.searchObject = { Status: 2, ...this.filterForm.value };
    }

    resetFilterForm() {
        this.searchObject = null;
        this.filterForm.reset();
    }

    onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.submitFilter();
    }

    getTotalPrice(): number {
        if (!this.selectedOrderItems || this.selectedOrderItems.length === 0) {
            return 0;
        }

        return this.selectedOrderItems.reduce((total, item) => {
            return total + (item.totalPrice || 0);
        }, 0);
    }
}
