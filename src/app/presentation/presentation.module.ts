import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { LoadingComponent } from './shared/loading/loading';
import { ManagementModule } from './management/management.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { RequestsModule } from './requests/requests.module';
import { OffersModule } from './offers/offers.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ContractsModule } from './contracts/contracts.module';

@NgModule({
  declarations: [
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    TranslateModule,
    ManagementModule,
    RequestsModule,
    OffersModule,
    AppLayoutModule,
    ApprovalsModule,
    ContractsModule
  ],
  exports: [
    LoadingComponent,
  ]
})
export class PresentationModule { }
