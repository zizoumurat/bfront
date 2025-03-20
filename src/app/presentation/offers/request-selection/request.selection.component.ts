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
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';

@Component({
    selector: 'app-request-selection',
    templateUrl: './request.selection.component.html'
})

export class RequestSelectionComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    selectedRow: any;
    locationOptions!: ListItemModel[];
    currencyOptions: ListItemModel[];

    visibleCancellation: boolean;

    filterForm: FormGroup;
    cancellationForm: FormGroup;

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
        this.createCancellationForm();
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
                name: 'locationName',
                label: 'locationName'
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
                label: 'viewOffers', icon: 'pi pi-list', command: () => { this.viewOffers() },
            },
            {
                label: 'viewComparisonChart', icon: 'pi pi-chart-bar',
                command: () => { this.viewComparisonTable() }
            },
            {
                label: 'summaryBiddingProcess',
                icon: 'pi pi-chart-line',
                command: () => { this.viewSummary() }
            },
            {
                label: 'cancelOfferCollectionProcess', icon: 'pi pi-file-excel', command: () => { this.cancel() },
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

    createCancellationForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators, updateOn: 'change' });

        this.cancellationForm = this.fb.group({
            id: control(null, [Validators.required]),
            cancellationReasion: control(null, [Validators.required]),
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

    viewOffers() {
        this.router.navigate([`/offers/offer-management/${this.table.selectedRow.id}`]);
    }

    viewSummary() {
        this.router.navigate([`/offers/summary-bidding/${this.table.selectedRow.id}`]);
    }

    viewComparisonTable() {
        const request = this.table.selectedRow;

        if (request.state < RequestStateEnum.ComparisonTableCreated) {
            this.messageService.showError("Talep için karşılaştırma tablosu henüz oluşturulmamış !")

            return;
        }


        const currentUser = this.authHelper.getCurrentUser();

        if (request.managerId === currentUser.id) {
            this.router.navigateByUrl(`/offers/comparison-table/${request.id}`);

            return;
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


    async cancel() {
        const request = this.table.selectedRow;

        if (request.state === RequestStateEnum.Completed) {
            this.messageService.showError("Teklif toplama süreci tamamlandığı için iptal edilemez.")

            return;
        }

        if (request.state === RequestStateEnum.Cancelled) {
            this.messageService.showError("Teklif toplama süreci zaten iptal edilmiş.")

            return;
        }

        const currentUser = this.authHelper.getCurrentUser();
        if (request.managerId == currentUser.id) {
            this.cancellationForm.reset();
            this.cancellationForm.get('id').setValue(request.id);
            this.visibleCancellation = true;
        }
    }

    async submitCancel() {
        if (this.cancellationForm.valid) {

            await this.service.cancelBidCollection(this.cancellationForm.value);

            this.visibleCancellation = false;
            this.cancellationForm.reset();
            this.table.refresh();
        }
    }

    submitFilter() {
        this.searchObject = this.filterForm.value;
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
