import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractsPendingApprovalComponent } from './contracts-pending-approval/contracts-pending-approvalcomponent';
import { ContractsArchiveComponent } from './contracts-archive/contracts-archive.component';

const routes: Routes = [
    {
        path: 'contracts-pending-approval',
        component: ContractsPendingApprovalComponent,
        data: { breadcrumb: 'pendingApprovalContracts' }
    },
    {
        path: 'contracts-archive',
        component: ContractsArchiveComponent,
        data: { breadcrumb: 'pendingApprovalContracts' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractsRoutingModule { }
