import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
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
import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';
import { PerformanceManagementComponent } from './performance-management/performance-management.component';
import { RatingModule } from 'primeng/rating';


@NgModule({
	declarations: [
		PortfolioManagementComponent,
		PerformanceManagementComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		CustomersRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		DropdownModule,
		InputTextModule,
		ButtonModule,
		CardModule,
		PanelModule,
		RatingModule,
		InputNumberModule,
		InputTextareaModule,
		TableModule,
		MenuModule,
		StepsModule,
		SelectButtonModule,
		CalendarModule,
		SharedModule,
		RequestsModule,
	],
	exports: []
})
export class CustomersModule { }

