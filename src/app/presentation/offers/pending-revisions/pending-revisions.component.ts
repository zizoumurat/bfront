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
import { RequestStateEnum } from 'src/app/core/enums/request.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMPANY_SERVICE } from 'src/app/service/company.service';
import { ICompanyService } from 'src/app/core/services/i.company.service';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { OFFER_SERVICE } from 'src/app/service/offer.service';
import { IOfferService } from 'src/app/core/services/i.offer.service';

@Component({
    templateUrl: './pending-revisions.component.html'
})

export class PendingRevisionsComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { isRevised: true };
    totalRecords: number;
    selectedRow: any;

    companyOptions!: ListItemModel[];
    locationOptions!: ListItemModel[];

    visibleRejection: boolean;
    visibleDetails: boolean;
    tableData: any;

    filterForm: FormGroup;
    rejectForm: FormGroup;

    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(REQUEST_SERVICE) protected service: IRequestService,
        @Inject(OFFER_SERVICE) protected offerService: IOfferService,
        @Inject(COMPANY_SERVICE) protected companyService: ICompanyService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private router: Router,
        private messageService: NotificationHelper,
        private authHelper: AuthHelper,
        private confirmationService: ConfirmationService,
        private translateService: TranslateService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {

        this.columns = [
            {
                name: "companyName",
                label: "requestingCompany",
            },
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
                name: 'manager',
                label: 'manager',
            },
            {
                name: 'locationName',
                label: 'requestLocation'
            },
            {
                name: 'requestedSupplyDate',
                label: 'requestedSupplyDate',
                type: FormatEnum.date
            }
        ];

        this.actionItems = [
            {
                label: 'makeOffer', icon: 'pi pi-send', command: () => { this.makeOffer() },
            },
            {
                label: 'viewDetails', icon: 'pi pi-search',
                command: () => { this.viewDetails() }
            },
            {
                label: 'rejectOffer', icon: 'pi pi-file-excel', command: () => { this.rejectOffer() },
            },
        ];

        this.createFilterForm();
        this.createRejectForm();
        this.getComapnyList();
        this.getLocationList();
    }

    async getComapnyList() {
        this.companyOptions = await this.companyService.getCompanyList();
    }

    async getLocationList() {
        this.locationOptions = await this.listService.getSelectedItemList("location");
    }

    createFilterForm() {
        const control = (defaultValue: any) =>
            this.fb.control(defaultValue);

        this.filterForm = this.fb.group({
            companyId: control(null),
            requestCode: control(null),
            locationId: control(null),
            title: control(null),
        });
    }

    createRejectForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators, updateOn: 'change' });

        this.rejectForm = this.fb.group({
            requestId: control(null, [Validators.required]),
            rejectionReason: control(null, [Validators.required]),
        });
    }

    makeOffer() {
        this.router.navigate([`/offers/make-offer/${this.table.selectedRow.id}`]);
    }

    viewDetails() {
        const request = this.table.selectedRow as RequestModel;
        this.tableData = JSON.parse(request.template.data);
        this.visibleDetails = true;
    }

    private isUserInCategoryUsers(request, userId: number): boolean {
        return request.categoryUsers.includes(userId);
    }

    private handleManagerAssignment(request, currentUser) {
        if (request.managerId === currentUser.id) {
            this.router.navigateByUrl(`/requests/purchasing-process-preference/${request.id}`);
        } else if (request.managerId === null) {
            this.confirmAssignment(request);
        }
    }

    private confirmAssignment(request) {
        this.confirmationService.confirm({
            header: this.translateService.instant('authorizationAssignmentApproval'),
            message: this.translateService.instant('assignAsResponsibleForRequest', { 0: request.requestCode }),
            accept: () => {
                this.service.assignManager(request.id)
                this.router.navigateByUrl(`/requests/purchasing-process-preference/${request.id}`);
            }
        });
    }

    submitFilter() {
        this.searchObject = { ...this.searchObject, ...this.filterForm.value };
    }

    onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.submitFilter();
    }

    rejectOffer() {
        this.visibleRejection = true;
        this.rejectForm.reset();
        this.rejectForm.controls['requestId'].setValue(this.table.selectedRow.id);
    }

    async submitReject() {
        if (!this.rejectForm.valid)
            return;

        await this.offerService.rejectOffer({ ...this.rejectForm.value });

        this.visibleRejection = false;

        this.table.refresh();
    }
}
