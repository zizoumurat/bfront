import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { NIOTIFICATION_SERVICE } from 'src/app/service/notification.service';
import { INotificationService } from 'src/app/core/services/i.notification.service';
import { NotificationModel } from 'src/app/core/domain/notification.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { Router } from '@angular/router';
import { CurrentUserModel } from 'src/app/core/domain/models/auth.model';
import { ContractSignalRService } from 'src/app/core/helpers/signalR/ContractSignalRService';
import { ReceiveNotificationService } from 'src/app/core/helpers/signalR/ReceiveNotificationService';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    notifications!: NotificationModel[];
    user!: CurrentUserModel;
    userPhoto: string = "/assets/layout/images/topbar/avatar-eklund.png";
    showManagementPanel: boolean;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private service: ReceiveNotificationService,
        private authHelper: AuthHelper,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        this.user = this.authHelper.getCurrentUser();
        this.getUserPhoto();
        this.getNotifications();
        this.showManagementPanel = this.authHelper.isAuthorized(['adminPanel.create'])
    }

    async getNotifications() {
        this.service.startConnection(this.user.id.toString());
        this.service.notifications$.subscribe(notifications => {
          this.notifications = notifications;
        });
    }

    get newNotifications() {
        const count = (this.notifications || []).length

        return count || "";
    }

    getUserPhoto(): void {
        if (this.user.userPhotoUrl)
            this.userPhoto = `data:image/jpeg;base64,${this.user.userPhotoUrl}`;
    }

    logOut() {
        this.authHelper.logout();
        this.router.navigate(['/auth/login']);
    }
}
