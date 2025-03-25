import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { SVG_ICONS } from 'src/app/core/constants/svg.constant';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private authHelper: AuthHelper) { }

    ngOnInit() {
        this.model = [
            { label: 'home', icon: 'pi pi-fw pi-microsoft', routerLink: '/' },
            {
                label: 'requests',
                icon: "pi pi-fw pi-book",
                items: [
                    {
                        label: 'allRequests', routerLink: '/requests/list',
                        visible: this.authHelper.isAuthorized(['requests.creator', 'requests.owner'])
                    },
                    {
                        label: 'createRequest',
                        icon: "pi pi-plus",
                        routerLink: '/requests/create-request', class: 'custom-menu-item',
                        visible: this.authHelper.isAuthorized(['requests.creator'])
                    },
                ]
            },
            {
                label: "offers",
                svg: SVG_ICONS.FIRE,
                routerLink: "/offers",
                items: [
                    {
                        label: "requestSelection",
                        routerLink: "/offers/request-selection",
                        visible: this.authHelper.isAuthorized(["offers.requestSelection"]),
                    },
                    {
                        label: "reverseOpenAuctionList",
                        routerLink: "offers/reverse-auction-list",
                        visible: this.authHelper.isAuthorized(["offers.allocation"]),
                    },
                    {
                        label: "currentRequests",
                        routerLink: "/offers/current-requests",
                        visible: this.authHelper.isAuthorized(["offers.currentRequests"]),
                    },
                    {
                        label: "makeOffer",
                        routerLink: "/offers/make-offer",
                        visible: this.authHelper.isAuthorized(["offers.makeOffer"]),
                    },
                    {
                        label: "offerHistory",
                        routerLink: "/offers/offer-history",
                        visible: this.authHelper.isAuthorized(["offers.offerHistory"]),
                    },
                    {
                        label: "revisionRequestsOffers",
                        routerLink: "/offers/pending-revisions",
                        visible: this.authHelper.isAuthorized(["offers.revisedOffersRequested"]),
                    },
                    {
                        label: "Ters Açık Artırma",
                        routerLink: "/tr/teklifler/ters-acik-arttirma-requester",
                        visible: this.authHelper.isAuthorized(["offers.reverseOpenAuctionSupplier"]),
                    },
                ],
            },
            {
                label: "approvals",
                icon: "pi pi-fw pi-check-square",
                routerLink: "/approvals",
                items: [
                    {
                        label: "pendingApprovalRequests",
                        routerLink: "/approvals/requests-pending-approval",
                        visible: true
                        // visible: this.authHelper.isAuthorized(["approvals.pendingApprovalRequests"]),
                    },
                    {
                        label: "approvalRequestsArchive",
                        routerLink: "/approvals/approval-request-archive",
                        visible: true,
                        // visible: this.authHelper.isAuthorized(["approvals.approvalRequestsArchive"]),
                    }
                ],
            },
            {
                label: "contracts",
                icon: "pi pi-fw pi-file",
                routerLink: "/contracts",
                items: [
                    {
                        label: "pendingApprovalContracts",
                        routerLink: "/contracts/contracts-pending-approval",
                        visible: true,
                    },
                    {
                        label: "contractsArchive",
                        routerLink: "/contracts/contracts-archive",
                        visible: true,
                    },
                ],
            },
            {
                label: "orders",
                icon: "pi pi-fw pi-shopping-bag",
                routerLink: "/orders",
                items: [
                    {
                        label: "orderList",
                        routerLink: "/orders/order-list",
                        visible: this.authHelper.isAuthorized(["orders.orderLists"]),
                    },
                    {
                        label: "orderList",
                        routerLink: "/orders/order-list-supplier",
                        visible: this.authHelper.isAuthorized(["offers.makeOffer"]),
                    },
                    {
                        label: "orderArchive",
                        routerLink: "/orders/order-archive",
                        visible: this.authHelper.isAuthorized(["orders.orderArchive"]),

                    },
                    {
                        label: "statusUpdate",
                        routerLink: "/orders/status-update",
                        visible: this.authHelper.isAuthorized(["orders.statusUpdate"]),
                    },
                ],
            },
            {
                label: "payments",
                icon: "pi pi-fw pi-shopping-bag",
                routerLink: "/payments",
                items: [
                    {
                        label: "paymentList",
                        routerLink: "/payments/payment-list",
                        visible: this.authHelper.isAuthorized(["payments.paymentLists"]),
                    },
                    {
                        label: "paymentApprovals",
                        routerLink: "/orders/order-list-supplier",
                        visible: this.authHelper.isAuthorized(["payments.paymentApprovals"]),
                    },
                    {
                        label: "paymentInstructions",
                        routerLink: "/orders/order-archive",
                        visible: this.authHelper.isAuthorized(["payments.paymentInstructions"]),

                    },
                ],
            },
            {
                label: "suppliers",
                icon: "pi pi-fw pi-sitemap",
                routerLink: "/suppliers",
                items: [
                    {
                        label: "supplierPortfolioManagement",
                        routerLink: "/suppliers/portfolio-management",
                        visible: this.authHelper.isAuthorized(["customers.supplierPortfolioManagement"]),
                    },
                    {
                        label: "supplierPerformanceManagement",
                        routerLink: "/suppliers/performance-management",
                        visible: this.authHelper.isAuthorized(["customers.supplierPerformanceManagement"]),
                    },
                ],
            },
            {
                label: "customers",
                icon: "pi pi-fw pi-sitemap",
                routerLink: "/customers",
                items: [
                    {
                        label: "permission.customerPortfolioManagement",
                        routerLink: "/customers/portfolio-management",
                        visible: this.authHelper.isAuthorized(["suppliers.customerPortfolioManagement"]),
                    },
                    {
                        label: "permission.customerPerformanceManagement",
                        routerLink: "/customers/performance-management",
                        visible: this.authHelper.isAuthorized(["suppliers.customerPerformanceManagement"]),
                    },
                ],
            },
        ];
    }

    getVisible(item) {
        return !item.separator && (!item.items || item.items.some(x => x.visible));
    }
}
