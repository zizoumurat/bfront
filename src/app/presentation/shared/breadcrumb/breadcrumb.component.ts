import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbHelper } from 'src/app/core/helpers/breadcrumb/breadcrumb.helper';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: "./breadcrumb.component.html",
})
export class BreadcrumbComponent {
    breadcrumbItems: any[] = [];
    home: MenuItem;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: BreadcrumbHelper
    ) {

        this.home = { icon: 'pi pi-home', routerLink: '/' }
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.breadcrumbItems = this.breadcrumbService.getBreadcrumb(this.activatedRoute.root);
            }
        });
    }
}
