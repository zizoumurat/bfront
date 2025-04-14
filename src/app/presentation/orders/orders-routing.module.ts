import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderListComponent } from './order-list/order-list.component';
import { OrderArchiveComponent } from './order-archive/order-archive.component';
import { StatusUpdateComponent } from './status-update/status-update.component';
import { OrderListSupplierComponent } from './order-list-supplier/order-list-supplier.component';

const routes: Routes = [
    {
        path: 'order-list',
        component: OrderListComponent,
        data: { breadcrumb: 'orderList' }
    },
    {
        path: 'order-archive',
        component: OrderArchiveComponent,
        data: { breadcrumb: 'orderArchive' }
    },
    {
        path: 'status-update',
        component: StatusUpdateComponent,
        data: { breadcrumb: 'statusUpdate' }
    },
    {
        path: 'order-list-supplier',
        component: OrderListSupplierComponent,
        data: { breadcrumb: 'orderList' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
