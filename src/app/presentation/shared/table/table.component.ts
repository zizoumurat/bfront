import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Observable } from 'rxjs';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { IGenericService } from 'src/app/core/services/generic/i.generic.service';
import { FormatEnum } from 'src/app/core/enums/format.enum';
import { TableMenuItem } from './models/TableMenuItem';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-table',
    templateUrl: "./table.component.html",
})
export class AppTableComponent<T> {
    @Input() columns: any[];
    @Input() rows: number = 10;
    @Input() items: any[];
    @Input() showActions: boolean = true;
    @Input() showPaginatior: boolean = true;
    @Input() actionItems: TableMenuItem[];
    @Input() searchObject: any;
    @Input() service: IGenericService<T>;
    @Input() dataKey: string;
    @Input() dataEnrichmentFn: ((data: T[]) => Observable<T[]>) | null = null;
    @Output() selectedItemsChanged = new EventEmitter<any[]>();

    totalRecords: number;
    selectedRow: any;
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    columnStyles: any[] = [];

    @ViewChild('actions') actions: Menu;

    selectedItem: any = null;
    routeId: string | null = null;

    constructor(private route: ActivatedRoute) {
    }

    onCheckboxChange(event: any, item: any) {
        if (event.checked) {
            if (this.selectedItem) {
                this.selectedItem.selected = false;
            }
            this.selectedItem = item;
        } else {
            this.selectedItem = null;
        }

        this.selectedItemsChanged.emit(this.selectedItem);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['searchObject'] && changes['searchObject'].previousValue !== changes['searchObject'].currentValue) {
            this.loadData(null)
        }
    }

    ngOnInit() {
        this.getColumnStyle();
        this.columns = this.columns.map(col => ({
            ...col,
            sortable: col.sortable !== false
        }));
    }

    selectRowById(id: string | null) {
        if (!id || !this.items?.length) return;

        const matchedItem = this.items.find(item => item.id == id);
        if (matchedItem) {
            if (this.selectedItem) {
                this.selectedItem.selected = false;
            }
            matchedItem.selected = true;
            this.selectedItem = matchedItem;
            this.selectedItemsChanged.emit(this.selectedItem);
        }
    }

    protected async loadData(event?: LazyLoadEvent) {
        this.lastLazyLoadEvent = event;
        const paginationFilter = new PaginationFilterModel();

        if (event) {
            paginationFilter.page = Number(event.first / event.rows);
            paginationFilter.sortByMultiName = [event.sortField || "Id"];
            paginationFilter.sortByMultiOrder = [event.sortOrder];
            paginationFilter.pageSize = event.rows;
        }

        var result = await this.service.getPaginationList(paginationFilter, this.searchObject);

        this.items = result.items.map(row => ({
            ...row,
            actionItems: this.showActions ?  this.getActionItemsForRow(row) : []
        }))

        this.totalRecords = result.count;

        if (this.dataEnrichmentFn) {
            this.dataEnrichmentFn(this.items).subscribe((enrichedData) => {
                this.items = enrichedData;
            });
        }

        this.route.paramMap.subscribe(params => {
            this.routeId = params.get('id');
            this.selectRowById(this.routeId);
        });
    }

    getActionItemsForRow(row: any): any[] {
        const list = this.actionItems.map(button => ({
            ...button,
        }));

        list.forEach(button => {
            if (button.handleOptions)
                button.handleOptions(row, button)
        })

        return list;
    }

    refresh() {
        this.loadData(this.lastLazyLoadEvent);
    }

    onMenuClick(event: MenuItemCommandEvent, row: any, button: TableMenuItem) {
        this.selectedRow = row;
        if (button.command)
            button.command(event);
    }

    getColumnStyle() {
        this.columns.forEach((column) => {
            let style: any = column.style || {};

            if (column.width) {
                style['width'] = `${column.width}px`;
                style['min-width'] = `auto`;
            }

            column.style = style;
        });
    }
}