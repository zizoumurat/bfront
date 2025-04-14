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
    @Input() columns: any[]; // Kolon bilgileri
    @Input() rows: number = 10; // Satır sayısı
    @Input() items: any[]; // Tablo verisi
    @Input() showActions: boolean = true; // Eylem butonlarını gösterme durumu
    @Input() showPaginatior: boolean = true; // Sayfalama gösterme durumu
    @Input() actionItems: TableMenuItem[]; // Eylem butonları
    @Input() searchObject: any; // Arama nesnesi
    @Input() service: IGenericService<T>; // Servis
    @Input() dataKey: string; // Veri anahtarı
    @Input() dataEnrichmentFn: ((data: T[]) => Observable<T[]>) | null = null; // Veri zenginleştirme fonksiyonu
    @Input() summaryColumns: any[] = []; // Özet gösterilecek sütunlar
    @Input() showFooter: boolean = false; // Özet gösterilecek sütunlar
    @Output() selectedItemsChanged = new EventEmitter<any[]>(); // Seçilen öğeler değiştiğinde tetiklenen olay

    totalRecords: number; // Toplam kayıt sayısı
    selectedRow: any; // Seçilen satır
    lastLazyLoadEvent: LazyLoadEvent | undefined; // Son lazy load eventi
    columnStyles: any[] = []; // Kolon stil bilgileri

    @ViewChild('actions') actions: Menu; // Eylem menüsü

    selectedItem: any = null; // Seçilen öğe
    routeId: string | null = null; // Route ID

    columnVisibility: { [key: string]: boolean } = {}; // Her bir sütunun özet olarak görünürlük durumu
    columnTotals: { [key: string]: number } = {}; // Kolon toplamları
    columnFormats: { [key: string]: string } = {}; // Kolon formatları (para birimi, sayı vs.)
    loading: boolean = true; 

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.getColumnStyle();

        // Sütunların özet görünürlük durumunu hesaplayalım
        this.columns.forEach(column => {
            const isSummaryColumn = this.summaryColumns.some(sc => sc.name === column.name);
            this.columnVisibility[column.name] = isSummaryColumn;
        });

        // Kolon formatlarını ayarlayalım (örnek olarak)
        this.columns.forEach(column => {
            this.columnFormats[column.name] = column.format || '1.0-2'; // Format parametresi, default olarak sayı formatı
        });

        this.columns = this.columns.map(col => ({
            ...col,
            sortable: col.sortable !== false
        }));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['searchObject'] && changes['searchObject'].previousValue !== changes['searchObject'].currentValue) {
            this.loadData(null);
        }
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

    async loadData(event?: LazyLoadEvent) {
        this.loading = true;
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
            actionItems: this.showActions ? this.getActionItemsForRow(row) : []
        }));

        this.totalRecords = result.count;

        if (this.dataEnrichmentFn) {
            this.dataEnrichmentFn(this.items).subscribe((enrichedData) => {
                this.items = enrichedData;
            });
        }

        // Column totals hesaplama
        this.calculateColumnTotals();

        this.route.paramMap.subscribe(params => {
            this.routeId = params.get('id');
            this.selectRowById(this.routeId);
        });

        this.loading = false;
    }

    getActionItemsForRow(row: any): any[] {
        const list = this.actionItems.map(button => ({
            ...button,
        }));

        list.forEach(button => {
            if (button.handleOptions)
                button.handleOptions(row, button);
        });

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

    // Yeni fonksiyonlar
    calculateColumnTotals() {
        // Özet kolonlara göre toplamları hesapla
        this.columns.forEach(column => {
            if (this.columnVisibility[column.name]) {
                let total = 0;
                this.items.forEach(item => {
                    const value = item[column.name];
                    if (typeof value === 'number') {
                        total += value;
                    }
                });
                this.columnTotals[column.name] = total;
            }
        });
    }
}
