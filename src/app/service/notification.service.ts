// Location.service.ts
import { Injectable, InjectionToken } from '@angular/core';
import { NotificationModel } from '../core/domain/notification.model';
import { INotificationService } from '../core/services/i.notification.service';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class NotificationService implements INotificationService {

    constructor(private http: HttpClient) { }

    async getAll(): Promise<NotificationModel[]> {
        return firstValueFrom(this.http.get<NotificationModel[]>(`${BASE_URL}/Notifications`));
    }

}

export const NIOTIFICATION_SERVICE = new InjectionToken<INotificationService>('NotificationService');
