import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { StepsModule } from 'primeng/steps';
import { SelectButtonModule } from "primeng/selectbutton";
import { CalendarModule } from "primeng/calendar";
import { SharedModule } from '../shared/shared.module';
import { RequestsModule } from '../requests/requests.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaymentListComponent } from './payment-list/payment-list.component';

@NgModule({
	declarations: [
		PaymentListComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		PaymentsRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		DropdownModule,
		InputTextModule,
		ButtonModule,
		CardModule,
		PanelModule,
		InputNumberModule,
		InputTextareaModule,
		TableModule,
		MenuModule,
		StepsModule,
		SelectButtonModule,
		CalendarModule,
		SharedModule,
		RequestsModule,
		TabMenuModule
	],
	exports: []
})
export class PaymentsModule { }

