import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './presentation/shared/notfound/notfound.component';
import { AppLayoutComponent } from "./presentation/layout/app.layout.component";
import { authGuard } from './core/guards/auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                    { path: 'home', loadChildren: () => import('./presentation/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'management', loadChildren: () => import('./presentation/management/management.module').then(m => m.ManagementModule), data: { breadcrumb: 'managementPanel' } },
                    { path: 'requests', loadChildren: () => import('./presentation/requests/requests.module').then(m => m.RequestsModule) },
                    { path: 'offers', loadChildren: () => import('./presentation/offers/offers.module').then(m => m.OffersModule), data: { breadcrumb: 'offers' } },
                    { path: 'approvals', loadChildren: () => import('./presentation/approvals/approvals.module').then(m => m.ApprovalsModule), data: { breadcrumb: 'approvals' } },
                    { path: 'contracts', loadChildren: () => import('./presentation/contracts/contracts.module').then(m => m.ContractsModule), data: { breadcrumb: 'contracts' } },
                    { path: 'suppliers', loadChildren: () => import('./presentation/suppliers/suppliers.module').then(m => m.SuppliersModule), data: { breadcrumb: 'suppliers' } },
                    { path: 'customers', loadChildren: () => import('./presentation/customers/customers.module').then(m => m.CustomersModule), data: { breadcrumb: 'customers' } },
                    { path: 'orders', loadChildren: () => import('./presentation/orders/orders.module').then(m => m.OrdersModule), data: { breadcrumb: 'orders' } },
                    { path: 'payments', loadChildren: () => import('./presentation/payments/payments.module').then(m => m.PaymentsModule), data: { breadcrumb: 'payments' } },
                ]
            },
            { path: 'auth', loadChildren: () => import('./presentation/auth/auth.module').then(m => m.AuthModule) },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
