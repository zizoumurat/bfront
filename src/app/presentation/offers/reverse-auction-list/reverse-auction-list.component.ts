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
import { REVERSEAUCTION_SERVICE } from 'src/app/service/reverseAuction.service';
import { IReverseAuctionService } from 'src/app/core/services/i.reverseAuction.service';

@Component({
    selector: 'app-reverse-auction-list',
    templateUrl: './reverse-auction-list.component.html'
})

export class ReverseAuctionListComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any = { isReverseAuction: true };
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
        @Inject(REVERSEAUCTION_SERVICE) protected service: IReverseAuctionService,
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
                name: 'requestTitle',
                label: 'title'
            },
            {
                name: 'participantList',
                label: 'participantList',
                type: FormatEnum.participantList
            },
            {
                name: 'startTime',
                label: 'startTime',
                type: FormatEnum.dateTime
            },
            {
                name: 'endTime',
                label: 'endTime',
                type: FormatEnum.dateTime
            },
            {
                name: 'times',
                label: 'statu',
                type: FormatEnum.startStatu
            }
        ];
    }

    initialActionItems() {
        this.actionItems = [
            {
                label: 'enterToAuction', icon: 'pi pi-sign-in', command: () => { this.enterToAuction() },
            },
            {
                label: 'viewComparisonChart', icon: 'pi pi-chart-bar',
                command: () => { this.viewComparisonTable() }
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

        var result = await this.service.getPaginationList(paginationFilter, { isReverseAuction: true, ...this.searchObject });

        this.items = result.items;
        this.totalRecords = result.count;
    }

    enterToAuction() {
        this.router.navigate([`/offers/reverse-auction/${this.table.selectedRow.requestId}`]);
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


            this.visibleCancellation = false;
            this.cancellationForm.reset();
            this.table.refresh();
        }
    }

    submitFilter() {
        this.searchObject = { isReverseAuction: true, ...this.filterForm.value };
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
