import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OffersRoutingModule } from './offers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestSelectionComponent } from './request-selection/request.selection.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TranslateModule } from "@ngx-translate/core";
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { StepsModule } from 'primeng/steps';
import { SelectButtonModule } from "primeng/selectbutton";
import { CalendarModule } from "primeng/calendar";
import { SharedModule } from '../shared/shared.module';
import { ComparisonTableComponent } from './comparison-table/comparison.table.component';
import { OfferBoxComponent } from './components/offer-box/offer-box.component';
import { OfferBoxListComponent } from './components/offer-box-list/offer-box-list.component';
import { OfferManagementComponent } from './offer-management/offer-management.component';
import { CountDownComponent } from './components/count-down/count-down.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReverseAuctionComponent } from './reverse-auction/reverse-auction.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ReverseAuctionListComponent } from './reverse-auction-list/reverse-auction-list.component';
import { AllocationComponent } from './allocation/allocation.component';
import { CurrentRequestsComponent } from './current-requests/current-requests.component';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { DialogModule } from 'primeng/dialog';
import { OfferHistoryComponent } from './offer-history/offer-history.component';
import { PendingRevisionsComponent } from './pending-revisions/pending-revisions.component';
import { SummaryBiddingComponent } from './summary-bidding/summary-bidding.component';
import { CreateRequestComponent } from '../requests/create-request/create-request.component';
import { RequestInfoComponent } from '../requests/create-request/components/request-info/request-info.component';
import { RequestTemplateComponent } from '../requests/create-request/components/request-template/request-template.component';
import { RequestsModule } from '../requests/requests.module';
import { OfferSelectionComponent } from './components/offer-selection/offer-selection.component';
import { SessionParametersComponent } from './components/session-parameters/session-parameters.component';
import { CountDownReverseAuctionComponent } from './components/count-down-reverse-auction/count-down-reverse-auction.component';
import { ReverseAuctionSupplierComponent } from './reverse-auction-supplier/reverse-auction-supplier.component';

@NgModule({
	declarations: [
		RequestSelectionComponent,
		ComparisonTableComponent,
		OfferManagementComponent,
		CountDownComponent,
		ReverseAuctionComponent,
		ReverseAuctionListComponent,
		AllocationComponent,
		CurrentRequestsComponent,
		MakeOfferComponent,
		OfferHistoryComponent,
		PendingRevisionsComponent,
		SummaryBiddingComponent,
		OfferSelectionComponent,
		SessionParametersComponent,
		CountDownReverseAuctionComponent,
		ReverseAuctionSupplierComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		OffersRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		DropdownModule,
		InputTextModule,
		ButtonModule,
		DialogModule,
		CardModule,
		PanelModule,
		TranslateModule,
		InputNumberModule,
		InputTextareaModule,
		RadioButtonModule,
		CheckboxModule,
		TableModule,
		MenuModule,
		StepsModule,
		SelectButtonModule,
		CalendarModule,
		SharedModule,
		RequestsModule
	],
	exports: []
})
export class OffersModule { }

