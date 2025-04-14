import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestsRoutingModule } from './requests-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestListComponent } from './list/request.list.component';
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
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from "primeng/selectbutton";
import { CalendarModule } from "primeng/calendar";
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag'
import { SharedModule } from '../shared/shared.module';
import { CreateRequestComponent } from './create-request/create-request.component';
import { RequestTemplateComponent } from './create-request/components/request-template/request-template.component';
import { FormsModule } from '@angular/forms';
import { PurchasingProcessPrefenceComponent } from './create-request/components/purchasing-process-prefence/purchasing-process-prefence.component';
import { RequestsContainerComponent } from './requests-container/requests-container.component';

@NgModule({
	declarations: [
		RequestsContainerComponent,
		RequestListComponent,
		CreateRequestComponent,
		RequestTemplateComponent,
		PurchasingProcessPrefenceComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		RequestsRoutingModule,
		ReactiveFormsModule,
		DropdownModule,
		InputTextModule,
		ButtonModule,
		CardModule,
		PanelModule,
		TranslateModule,
		InputNumberModule,
		InputTextareaModule,
		TableModule,
		MenuModule,
		StepsModule,
		RatingModule,
		TagModule,
		SelectButtonModule,
		CalendarModule,
		DialogModule,
		FormsModule,
		SharedModule
	],
})
export class RequestsModule { }

