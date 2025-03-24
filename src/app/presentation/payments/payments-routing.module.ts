import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
PaymentListComponent

const routes: Routes = [
    {
        path: 'payment-list',
        component: PaymentListComponent,
        data: { breadcrumb: 'orderList' }
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentsRoutingModule { }
