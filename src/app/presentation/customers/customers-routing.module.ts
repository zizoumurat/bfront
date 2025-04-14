import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';
import { PerformanceManagementComponent } from './performance-management/performance-management.component';
import { ReceivablesComponent } from './receivables/receivables.component';

const routes: Routes = [
    {
        path: "portfolio-management",
        component: PortfolioManagementComponent,
        data: { breadcrumb: 'supplierPortfolioManagement' }
    },
    {
        path: "performance-management",
        component: PerformanceManagementComponent,
        data: { breadcrumb: 'supplierPerformanceManagement' }
    },
    {
        path: "performance-management/:id",
        component: PerformanceManagementComponent,
        data: { breadcrumb: 'supplierPerformanceManagement' }
    },
    {
        path: "receivables",
        component: ReceivablesComponent,
        data: { breadcrumb: 'receivables' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
