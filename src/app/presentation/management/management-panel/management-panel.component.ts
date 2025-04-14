import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-management-panel",
    templateUrl: "./management-panel.component.html",
    styleUrls: ["./management-panel.component.scss"],
})

export class ManagementPanelComponent implements OnInit {
    menuItems: MenuItem[];

    constructor() { }

    ngOnInit(): void {
        this.setMenuItems();
    }

    setMenuItems() {
        this.menuItems = [
            {
                header: "managementParameters",
                items: [
                    { label: "companyInfo", routerLink: "company-info", icon: "pi-building" },
                    { label: "departments", routerLink: "departments", icon: "pi-sitemap" },
                    { label: "allUsers", routerLink: "users", icon: "pi-users" },
                    { label: "userRoles", routerLink: "user-roles", icon: "pi-id-card" },
                    { label: "locations", routerLink: "locations", icon: "pi-map-marker" },
                    
                ] as MenuItem[],
            },
            {
                header: "purchaseParameters",
                items: [
                    {
                        label: "categorySettings",
                        routerLink: "category-settings",
                        icon: "pi-cog",
                    },
                    { label: "quoteCollectionRules", routerLink: "offer-rules", icon: "pi-ticket" },
                    { label: "approvalChain", routerLink: "apply-chain", icon: "pi-link" },
                    {
                        label: "budgetDetermination",
                        routerLink: "budget-settings",
                        icon: "pi-chart-line",
                    },
                    {
                        label: "exchangeRateInfo",
                        routerLink: "currency-info",
                        icon: "pi-chart-bar",
                    },
                ] as MenuItem[],
            },
        ];
    }
}
