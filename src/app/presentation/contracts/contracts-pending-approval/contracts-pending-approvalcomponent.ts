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
import { ApprovalStatus, ContractStatusEnum, RequestStateEnum } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { Contract_SERVICE } from 'src/app/service/contract.service';
import { IContractService } from 'src/app/core/services/i.contract.service';
import { ContractModel } from 'src/app/core/domain/contract.model';

@Component({
    selector: "app-contracts-pending-approval",
    templateUrl: "./contracts-pending-approval.component.html",
})

export class ContractsPendingApprovalComponent implements OnInit {
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
    uploadContractForm: FormGroup;
    choosenApprovalStatus: ApprovalStatus;

    selectedFile: File | null = null;

    displayUploadContract: boolean;
    displayComments: boolean;
    contractId: number;

    currentUser = this.authHelper.getCurrentUser();


    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(Contract_SERVICE) protected service: IContractService,
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
        this.createUploadContractForm();
    }

    initialColumns() {
        this.columns = [
            {
                name: 'referenceCode',
                label: 'contractReference'
            },
            {
                name: 'supplier',
                label: 'supplierFirmTitle'
            },
            {
                name: 'requester',
                label: 'requestOwner'
            },
            {
                name: 'owner',
                label: 'manager'
            },
            {
                name: 'totalPrice',
                label: 'contractPrice',
                type: FormatEnum.currency
            },
            {
                name: 'startDate',
                label: 'contractStartDate',
                type: FormatEnum.date
            },
            {
                name: 'expirationDate',
                label: 'contractEndDate',
                type: FormatEnum.date
            },
            {
                name: 'contractStatus',
                label: 'contractStatus',
                type: FormatEnum.contractState
            },
        ];
    }

    initialActionItems() {
        this.actionItems = [
            {
                label: "sendComment",
                icon: "pi pi-comments",
                command: () => this.sendComment(),
            },
            {
                label: "uploadContract",
                icon: "pi pi-cloud-upload",
                class: "primary",
                command: () => this.uploadContract(),
            },
            {
                label: "downloadContract",
                icon: "pi pi-cloud-download",
                class: "primary",
                command: () => this.viewContracts(),
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

    createUploadContractForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators });

        this.uploadContractForm = this.fb.group({
            id: control(null, [Validators.required]),
            file: control(null, [Validators.required]),
            startDate: control(null),
            expirationDate: control(null),
        });
    }

    sendComment() {
        this.contractId = this.table.selectedRow.id;
        this.displayComments = true;
    }

    uploadContract() {
        const contract = this.table.selectedRow as ContractModel;
        this.displayUploadContract = true;
        this.uploadContractForm.get('id').setValue(contract.id);
    }

    viewContracts() {
        const contract = this.table.selectedRow as ContractModel;

        if (contract.contractStatus < ContractStatusEnum.Started) {
            this.messageService.showError('contractDocumentNotUploaded');

            return;
        }

        this.downloadDocument(contract.documentUrl, contract.documentName, contract.mimeType);
    }

    downloadDocument(base64Data: string, fileName: string, mimeType: string): void {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(blobUrl);
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
            this.visibleCancellation = false;
            await this.service.approveRejectRequest(this.approvalForm.value);
            this.approvalForm.reset();
            this.table.refresh();
        }
    }

    async submitUploadContractForm() {
        if (this.uploadContractForm.valid) {
            this.service.uploadContractFileDocument({ ...this.uploadContractForm.value, file: this.selectedFile });
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

    onFileReceived(file: File | null): void {
        this.uploadContractForm.get('file').setValue(file);
        this.selectedFile = file;
    }
}
