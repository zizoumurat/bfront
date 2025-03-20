import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { IRequestService } from 'src/app/core/services/i.request.service';
import { REQUEST_SERVICE } from 'src/app/service/request.service';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { AppTableComponent } from '../../shared/table/table.component';
import { RequestModel } from 'src/app/core/domain/request.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalStatus, RequestStateEnum } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';

@Component({
    selector: 'app-pending-approval',
    templateUrl: './pending-approval.component.html'
})

export class PendingApprovalComponent implements OnInit {
    ApprovalStatus = ApprovalStatus;
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { isForApproval: true };
    totalRecords: number;
    selectedRow: any;
    locationOptions!: ListItemModel[];
    currencyOptions: ListItemModel[];

    visibleCancellation: boolean;

    filterForm: FormGroup;
    approvalForm: FormGroup;
    choosenApprovalStatus: ApprovalStatus;


    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(REQUEST_SERVICE) protected service: IRequestService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private router: Router,
        private messageService: NotificationHelper,
        private authHelper: AuthHelper,
        private confirmationService: ConfirmationService,
        private translateService: TranslateService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initialActionItems();
        this.initialColumns();
        this.initialOptions();
        this.createFilterForm();
        this.createApprovalForm();
    }

    initialColumns() {
        this.columns = [
            {
                name: 'requestCode',
                label: 'requestCode'
            },
            {
                name: 'title',
                label: 'title'
            },
            {
                name: 'createdBy',
                label: 'createdBy'
            },
            {
                name: 'ownerUserList',
                label: 'manager',
                type: FormatEnum.userList
            },
            {
                name: 'amount',
                label: 'amount',
                type: FormatEnum.currency
            },
            {
                name: 'currencyName',
                label: 'currencyName'
            },
            {
                name: 'budgetInclusionStatus',
                label: 'budgetInclusionStatus',
                type: FormatEnum.budgetInclusionStatus
            },
            {
                name: 'state',
                label: 'requestStatus',
                type: FormatEnum.requestState
            },
            {
                name: 'requestedSupplyDate',
                label: 'requestedSupplyDate',
                type: FormatEnum.date
            },
            {
                name: 'estimatedSupplyDate',
                label: 'estimatedSupplyDate',
                type: FormatEnum.date
            }
        ];
    }

    initialActionItems() {
        this.actionItems = [
            {
                label: 'viewDetails', icon: 'pi pi-eye', command: () => { this.viewDetail() },
            },
            {
                label: 'approve', icon: 'pi pi-check',
                command: () => { this.setStatus(ApprovalStatus.Approved) }
            },
            {
                label: 'reject', icon: 'pi pi-times', command: () => { this.setStatus(ApprovalStatus.Rejected) },
            },
        ];

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

    viewDetail() {
        this.router.navigate([`/approvals/approval-request-detail/${this.table.selectedRow.id}`]);
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

            await this.service.approveRejectRequest(this.approvalForm.value);

            this.visibleCancellation = false;
            this.approvalForm.reset();
            this.table.refresh();
        }
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
}
