import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { ApprovalRequestArchiveComponent } from './approval-request-archive/approval-request-archive.component';
import { ApprovalRequestDetailComponent } from './approval-request-detail/approval-request-detailcomponent';

const routes: Routes = [
    {
        path: 'requests-pending-approval',
        component: PendingApprovalComponent,
        data: { breadcrumb: 'pendingApprovalRequests' }
    },
    {
        path: 'approval-request-archive',
        component: ApprovalRequestArchiveComponent,
        data: { breadcrumb: 'approvalRequestsArchive' }
    },
    {
        path: 'approval-request-detail',
        pathMatch: 'full',
        redirectTo: 'requests-pending-approval'
    },
    { path: 'approval-request-detail/:id', component: ApprovalRequestDetailComponent, data: { breadcrumb: 'approvalRequestDetail' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApprovalsRoutingModule { }
