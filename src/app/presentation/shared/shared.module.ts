import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatColumnPipe } from 'src/app/core/pipes/format-column.pipe';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ErrorMessageComponent } from './errormessage/errormessage.component';
import { AppTableComponent } from './table/table.component';
import { TranslateModule } from '@ngx-translate/core';
import { PanelDirective } from './directives/panel.directive';
import { DropDownDirective } from './directives/dropdown.directive';
import { SingleFileUploadComponent } from './fileUpload/single/single-file-upload.component';
import { FilterPanelComponent } from './filterPanel/filter-panel.component';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from "primeng/calendar";
import { RequestInfoComponent } from '../requests/create-request/components/request-info/request-info.component';
import { OfferSummaryComponent } from '../offers/components/offer-summary/offer-summary.component';
import { TemplateTableComponent } from '../offers/components/template-table/template-table.component';
import { OfferBoxListComponent } from '../offers/components/offer-box-list/offer-box-list.component';
import { OfferBoxComponent } from '../offers/components/offer-box/offer-box.component';
import { DialogModule } from 'primeng/dialog';
import { InfoBoxComponent } from '../offers/components/info-box/info-box.component';
import { ReverseAuctionOfferBoxComponent } from '../offers/components/reverse-auction-offer-box/reverse-auction-offer-box.component';
import { CalendarDirective } from './directives/calendar.directive';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
    declarations: [
        FormatColumnPipe,
        ErrorMessageComponent,
        AppTableComponent,
        SingleFileUploadComponent,
        PanelDirective,
        DropDownDirective,
        CalendarDirective,
        FilterPanelComponent,
        RequestInfoComponent,
        OfferSummaryComponent,
        TemplateTableComponent,
        ReverseAuctionOfferBoxComponent,
        OfferBoxComponent,
		OfferBoxListComponent,
        InfoBoxComponent
    ],
    imports: [
        CommonModule,
        MenuModule,
        TableModule,
        TranslateModule,
        ButtonModule,
		ReactiveFormsModule,
        FormsModule,
        PanelModule,
        RatingModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        InputNumberModule,
        InputTextareaModule,
        SelectButtonModule,
        CalendarModule,
        DialogModule,
    ],
    exports: [
        FormatColumnPipe,
        ErrorMessageComponent,
        AppTableComponent,
        SingleFileUploadComponent,
        PanelDirective,
        DropDownDirective,
        CalendarDirective,
        FilterPanelComponent,
        RequestInfoComponent,
        OfferSummaryComponent,
        TemplateTableComponent,
        OfferBoxComponent,
        ReverseAuctionOfferBoxComponent,
		OfferBoxListComponent,
        TranslateModule,
        DialogModule,
        InfoBoxComponent
    ]
})
export class SharedModule { }
