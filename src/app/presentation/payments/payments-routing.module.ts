import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentListApprovalComponent } from './payment-list-approval/payment-list-approval.component';
import { PaymentsInstructionsComponent } from './payments-instructions/payments-instructions.component';
PaymentListComponent

const routes: Routes = [
    {
        path: 'payment-list',
        component: PaymentListComponent,
        data: { breadcrumb: 'paymentList' }
    },
    {
        path: 'payment-approvals',
        component: PaymentListApprovalComponent,
        data: { breadcrumb: 'paymentApprovals' }
    },
    {
        path: "payments-instructions",
        component: PaymentsInstructionsComponent,
        data: { breadcrumb: 'paymentInstructions' }
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentsRoutingModule { }
