import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from 'primeng/inputmask';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementPanelComponent } from './management-panel/management-panel.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { SharedModule } from '../shared/shared.module';
import { DepartmentsComponent } from './departments/departments.component';
import { LocationsComponent } from './locations/locations.component';
import { CurrencyInfoComponent } from './currency-info/currency-info.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { BudgetSettingsComponent } from './budget-settings/budget-settings.component';
import { CategorySettingsComponent } from './category-settings/category-settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OfferRulesComponent } from './offer-rules/offer-rules.component';
import { ApplyChainComponent } from './apply-chain/apply-chain.component';
import { BankInfoComponent } from './bank-info/bank-info.component';


@NgModule({
  declarations: [
    ManagementPanelComponent,
    BankInfoComponent,
    CompanyInfoComponent,
    DepartmentsComponent,
    LocationsComponent,
    CurrencyInfoComponent,
    UsersComponent,
    RolesComponent,
    BudgetSettingsComponent,
    CategorySettingsComponent,
    UserProfileComponent,
    OfferRulesComponent,
    ApplyChainComponent
  ],
  imports: [
    TabMenuModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    CommonModule,
    RouterModule,
    ManagementRoutingModule,
    AccordionModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    DividerModule,
    FieldsetModule,
    PanelModule,
    PasswordModule,
    MessageModule,
    InputNumberModule,
    InputMaskModule,
    TranslateModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextareaModule,
    MultiSelectModule,
    MenuModule,
    SharedModule
  ]
})
export class ManagementModule { }
