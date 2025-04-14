import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPanelComponent } from './management-panel/management-panel.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
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

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    data: { breadcrumb: 'Yönetim Parametreleri' },
  },
  {
    path: 'home',
    component: ManagementPanelComponent,
    data: { breadcrumb: '' },

  },
  {
    path: 'company-info',
    component: CompanyInfoComponent,
    data: { breadcrumb: 'Şirket Bilgileri' },
  },
  {
    path: 'bank-info',
    component: BankInfoComponent,
    data: { breadcrumb: 'Banka Hesapları' },
  },
  {
    path: 'departments',
    component: DepartmentsComponent,
    data: { breadcrumb: 'Departmanlar' },
  },
  {
    path: 'locations',
    component: LocationsComponent,
    data: { breadcrumb: 'Lokasyonlar' },
  },
  {
    path: 'currency-info',
    component: CurrencyInfoComponent,
    data: { breadcrumb: 'Döviz Kuru Bilgileri' },
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { breadcrumb: 'Kullanıcılar' },
  },
  {
    path: 'user-roles',
    component: RolesComponent,
    data: { breadcrumb: 'Kullanıcı Rolleri' },
  },
  {
    path: 'budget-settings',
    component: BudgetSettingsComponent,
    data: { breadcrumb: 'Bütçe Belirleme' },
  },
  {
    path: 'category-settings',
    component: CategorySettingsComponent,
    data: { breadcrumb: 'Kategori Ayarları' },
  },
  {
    path: 'user-settings',
    component: UserProfileComponent,
    data: { breadcrumb: 'Kullanıcı Ayarları' },
  },
  {
    path: 'offer-rules',
    component: OfferRulesComponent,
    data: { breadcrumb: 'Teklif Toplama Kuralları' },
  },
  {
    path: 'apply-chain',
    component: ApplyChainComponent,
    data: { breadcrumb: 'Onay Zinciri' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
