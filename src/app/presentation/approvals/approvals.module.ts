import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApprovalsRoutingModule } from './approvals-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
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
import { ApprovalRequestArchiveComponent } from './approval-request-archive/approval-request-archive.component';
import { ApprovalRequestDetailComponent } from './approval-request-detail/approval-request-detailcomponent';


@NgModule({
	declarations: [
		PendingApprovalComponent,
		ApprovalRequestArchiveComponent,
		ApprovalRequestDetailComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		ApprovalsRoutingModule,
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
	],
	exports: []
})
export class ApprovalsModule { }

