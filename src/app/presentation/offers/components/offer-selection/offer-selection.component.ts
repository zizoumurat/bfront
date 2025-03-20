import { Component, Input } from '@angular/core';
import { FormatEnum } from 'src/app/core/enums/format.enum';

interface Column {
  label: string;
  field: string;
  type: FormatEnum;
}

interface OfferSummaryRow {
  id: number;
  name: string;
  order: number;
  totalPrice: number;
  avarageUnitPrice: number;
  currency: string;
}

interface OfferSummary {
  rows: OfferSummaryRow[],
  columns: Column[],
  currencyCode: string;
}


@Component({
  selector: 'app-offer-selection',
  templateUrl: './offer-selection.component.html',
  styleUrl: 'offer-selection.component.scss'
})

export class OfferSelectionComponent {
  @Input() offerSummary: OfferSummary | undefined;

  selectedOffers: any[];

  classList: string[] = ['participant', 'arrangement', 'total', 'average'];

  get coloredColumns(): Column[] {
    return this.offerSummary?.columns.map((column, index) => ({
      ...column,
      cssClass: this.classList[index % this.classList.length], 
    })) || [];
  }
}
