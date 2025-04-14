import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestListComponent } from './list/request.list.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { PurchasingProcessPrefenceComponent } from './create-request/components/purchasing-process-prefence/purchasing-process-prefence.component';
import { RequestsContainerComponent } from './requests-container/requests-container.component';

const routes: Routes = [
    {
        path: '',
        component: RequestsContainerComponent,
        data: { breadcrumb: 'requests' },
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: RequestListComponent, data: { breadcrumb: 'allRequests' } },
            { path: 'create-request', component: CreateRequestComponent, pathMatch: 'full', data: { breadcrumb: 'createRequest' } },
            { path: 'create-request/:id', component: CreateRequestComponent, data: { breadcrumb: 'createRequest' } },
            { path: 'create-request/:id/:mode', component: CreateRequestComponent, data: { breadcrumb: 'createRequest' } },
            { path: 'purchasing-process-preference/:id', component: PurchasingProcessPrefenceComponent, data: { breadcrumb: 'purchaseProcessPreference' } },
            { path: 'purchasing-process-preference/:id/:mode/:channelType', component: CreateRequestComponent, data: { breadcrumb: 'completePurchaseRequest' } }
        ]
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestsRoutingModule { }
