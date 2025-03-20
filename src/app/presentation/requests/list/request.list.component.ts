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

@Component({
    templateUrl: './request.list.component.html'
})

export class RequestListComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    selectedRow: any;

    @ViewChild('actions') actions: Menu;
    @ViewChild(AppTableComponent) table!: AppTableComponent<RequestModel>;

    constructor(
        @Inject(REQUEST_SERVICE) protected service: IRequestService,
        private router: Router,
        private messageService: NotificationHelper,
        private authHelper: AuthHelper,
        private confirmationService: ConfirmationService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {

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
                type: 'currency'
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

        this.actionItems = [
            {
                label: 'viewDetails', icon: 'pi pi-search', command: () => { this.viewDetail() },
            },
            {
                label: 'edit', icon: 'pi pi-pencil',
                command: () => { this.viewEdit() }
            },
            {
                label: 'delete', icon: 'pi pi-trash', command: () => { this.delete() },
            },
        ];
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

    viewDetail() {
        this.router.navigate([`/requests/create-request/${this.table.selectedRow.id}/view`]);
    }

    viewEdit() {
        const request = this.table.selectedRow;
        if (request.state !== RequestStateEnum.NotStarted) {
            this.messageService.showError("Talep için teklif toplama süreci başlatılmış.Değişiklik yapılamaz.")

            return;
        }


        const currentUser = this.authHelper.getCurrentUser();

        if (request.createdById === currentUser.id) {
            this.router.navigateByUrl(`/requests/create-request/${request.id}`);

            return;
        }

        if (this.isUserInCategoryUsers(request, currentUser.id)) {
            this.handleManagerAssignment(request, currentUser);
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
                this.service.assignManager(request.id)
                this.router.navigateByUrl(`/requests/purchasing-process-preference/${request.id}`);
            }
        });
    }


    async delete() {
        const request = this.table.selectedRow;

        if (request.state !== RequestStateEnum.NotStarted) {
            this.messageService.showError("Talep için teklif toplama süreci başlatılmış.Talep silinemez.")

            return;
        }

        const currentUser = this.authHelper.getCurrentUser();
        if (request.createdById === currentUser.id || request.ownerId === currentUser.id) {
            await this.service.delete(request.id);

            this.table.refresh();
        }
    }
}
