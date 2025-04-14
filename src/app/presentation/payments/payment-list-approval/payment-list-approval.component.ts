import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { AppTableComponent } from '../../shared/table/table.component';
import { RequestModel } from 'src/app/core/domain/request.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { ApprovalStatus } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAYMETNLIST_SERVICE } from 'src/app/service/paymentList.service';
import { IPaymentListService } from 'src/app/core/services/i.paymentList.service';
import { PaymentListModel } from 'src/app/core/domain/paymentList.model';
import { TableMenuItem } from '../../shared/table/models/TableMenuItem';

@Component({
    selector: "app-payment-list-approval",
    templateUrl: "./payment-list-approval.component.html",
})

export class PaymentListApprovalComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { status: 1 };
    totalRecords: number;
    selectedRow: any;

    visibleCancellation: boolean;

    filterForm: FormGroup;
    approvalForm: FormGroup;
    choosenApprovalStatus: ApprovalStatus;

    contractId: number;
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
        this.createApprovalForm();
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
                name: 'totalPrice',
                label: 'contractPrice',
                type: FormatEnum.currency
            },
            {
                name: 'approvalUsers',
                label: 'approvals',
                type: FormatEnum.approvals
            },
        ];
    }

    initialActionItems() {
        this.actionItems = [
            {
                label: "details",
                icon: "pi pi-search",
                class: "primary",
                command: () => this.viewDetails(),
            },
            {
                label: 'approve', icon: 'pi pi-check',
                command: () => { this.setStatus(ApprovalStatus.Approved) },
                handleOptions: (row: PaymentListModel, menuItem: TableMenuItem) => this.handleDisabled(row, menuItem),
            },
            {
                label: 'reject', icon: 'pi pi-times', command: () => { this.setStatus(ApprovalStatus.Rejected) },
                handleOptions: (row: PaymentListModel, menuItem: TableMenuItem) => this.handleDisabled(row, menuItem),
            },
        ];

    }

    handleDisabled(item: PaymentListModel, menuItem: TableMenuItem) {
        item.approvalUsers.find(x => x.id == this.currentUser.id).status == ApprovalStatus.Pending ? menuItem.visible = true : menuItem.visible = false;
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
    

    async setStatus(status: ApprovalStatus) {
        const request = this.table.selectedRow;
        this.choosenApprovalStatus = status;

        this.approvalForm.reset();
        this.approvalForm.get('id').setValue(request.id);
        this.approvalForm.get('status').setValue(status);
        this.visibleCancellation = true;
    }

    async submitApprovalForm() {
        if (this.approvalForm.valid) {
            this.visibleCancellation = false;
            await this.service.approveReject(this.approvalForm.value);
            this.approvalForm.reset();
            this.table.refresh();
        }
    }


    submitFilter() {
        this.searchObject = { Status: 1, ...this.filterForm.value };
    }

    resetFilterForm() {
        this.searchObject = null;
        this.filterForm.reset();
    }

    onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.submitFilter();
    }
}
