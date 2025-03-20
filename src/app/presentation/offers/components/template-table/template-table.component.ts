import { Component, Inject, Input } from '@angular/core';
import { TemplateModel } from 'src/app/core/domain/template.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { ITemplateService } from 'src/app/core/services/i.template.service';
import { TEMPLATE_SERVICE } from 'src/app/service/template.service';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrl: './template-table.component.scss'
})

export class TemplateTableComponent {
  @Input() template: TemplateModel | undefined;
  @Input() showTargetPrices: boolean = false;

  showDetails: boolean = false;
  data: any = { rows: [], columns: [] };
  visibleColumns: any[] = [];

  constructor(
    private messageService: NotificationHelper,
    @Inject(TEMPLATE_SERVICE) protected service: ITemplateService,
    private authHelper: AuthHelper
  ) { }

  ngOnChanges() {
    if (this.template?.data) {
      this.data = JSON.parse(this.template.data);

      // Tüm kolonlarda hideDetail mantığını uygula
      this.data.columns = this.data.columns.map((column: any) => ({
        ...column,
        hideDetail: column.name === 'quantity' || column.name === 'productDefinition' ? false : true,
      }));

      if (!this.data.columns.some((column: any) => column.name === 'targetPrice')) {
        this.data.columns.push({
          name: 'targetPrice',
          title: 'Hedef Fiyat',
        });

        this.data.rows.forEach((row: any) => {
          if (!row.hasOwnProperty('targetPrice')) {
            row.targetPrice = null;
          }
        });
      }

      this.updateVisibleColumns();
    }
  }

  updateVisibleColumns() {
    this.visibleColumns = this.showDetails
      ? this.data.columns
      : this.data.columns.filter((column: any) => !column.hideDetail);

    if (this.showTargetPrices && !this.visibleColumns.some(col => col.name === 'targetPrice')) {
      const targetPriceColumn = this.data.columns.find(col => col.name === 'targetPrice');
      if (targetPriceColumn) {
        this.visibleColumns.push(targetPriceColumn);
      }
    }
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
    this.updateVisibleColumns();
  }

  getTemplateData(): TemplateModel | undefined {
    if (!this.template) return undefined;
    return {
      ...this.template,
      data: JSON.stringify(this.data),
    };
  }

  areTargetPricesFilled(): boolean {
    return this.data.rows.every((row: any) => row.targetPrice !== '' && row.targetPrice !== null && row.targetPrice !== undefined);
  }

  saveTemplate(): void {
    if (!this.areTargetPricesFilled()) {

      this.messageService.showError("Lütfen tüm hedef fiyat alanlarını doldurun.")

      return;
    }

    this.service.update(this.getTemplateData())
  }

  hasRequestOwner() {
    return this.authHelper.hasRequestOwner();
  }
}
