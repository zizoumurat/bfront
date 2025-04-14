import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestSelectionComponent } from './request-selection/request.selection.component';
import { ComparisonTableComponent } from './comparison-table/comparison.table.component';
import { OfferManagementComponent } from './offer-management/offer-management.component';
import { ReverseAuctionComponent } from './reverse-auction/reverse-auction.component';
import { ReverseAuctionListComponent } from './reverse-auction-list/reverse-auction-list.component';
import { AllocationComponent } from './allocation/allocation.component';
import { CurrentRequestsComponent } from './current-requests/current-requests.component';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { OfferHistoryComponent } from './offer-history/offer-history.component';
import { PendingRevisionsComponent } from './pending-revisions/pending-revisions.component';
import { SummaryBiddingComponent } from './summary-bidding/summary-bidding.component';
import { ReverseAuctionSupplierComponent } from './reverse-auction-supplier/reverse-auction-supplier.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'request-selection',
        pathMatch: 'full'
    },
    { path: 'request-selection', component: RequestSelectionComponent, data: { breadcrumb: 'requestSelection' } },
    {
        path: 'comparison-table',
        pathMatch: 'full',
        redirectTo: 'request-selection'
    },
    { path: 'comparison-table/:id', component: ComparisonTableComponent, data: { breadcrumb: 'comparisonTable' } },
    {
        path: 'offer-management',
        pathMatch: 'full',
        redirectTo: 'request-selection'
    },
    { path: 'offer-management/:id', component: OfferManagementComponent, data: { breadcrumb: 'offerManagement' } },
    {
        path: 'reverse-auction',
        pathMatch: 'full',
        redirectTo: 'reverse-auction-list'
    },
    {
        path: 'reverse-auction-supplier',
        pathMatch: 'full',
        redirectTo: 'reverse-auction-supplier-list'
    },
    { path: 'reverse-auction/:id', component: ReverseAuctionComponent, data: { breadcrumb: 'reverseAuction' } },
    { path: 'reverse-auction-supplier/:id', component: ReverseAuctionSupplierComponent, data: { breadcrumb: 'reverseAuction' } },
    { path: 'reverse-auction-list', component: ReverseAuctionListComponent, data: { breadcrumb: 'reverseAuctionList' } },
    {
        path: 'allocation',
        pathMatch: 'full',
        redirectTo: 'request-selection'
    },
    { path: 'allocation/:id', component: AllocationComponent, data: { breadcrumb: 'allocation' } },
    {
        path: 'allocation',
        pathMatch: 'full',
        redirectTo: 'request-selection'
    },

    { path: 'current-requests', component: CurrentRequestsComponent, data: { breadcrumb: 'currentRequests' } },
    {
        path: 'make-offer',
        pathMatch: 'full',
        redirectTo: 'current-requests'
    },
    { path: 'make-offer/:id', component: MakeOfferComponent, data: { breadcrumb: 'makeOffer' } },
    { path: 'offer-history', component: OfferHistoryComponent, data: { breadcrumb: 'offerHistory' } },
    { path: 'pending-revisions', component: PendingRevisionsComponent, data: { breadcrumb: 'revisionRequestsOffers' } },
    {
        path: 'summary-bidding',
        pathMatch: 'full',
        redirectTo: 'request-selection'
    },
    { path: 'summary-bidding/:id', component: SummaryBiddingComponent, data: { breadcrumb: 'summaryBiddingProcess' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OffersRoutingModule { }
