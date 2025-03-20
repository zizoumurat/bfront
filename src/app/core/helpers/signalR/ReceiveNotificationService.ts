import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Contract_SERVICE } from 'src/app/service/contract.service';
import { BASE_HUB_URL } from 'src/environments/environment';
import { IContractService } from '../../services/i.contract.service';
import { INotificationService } from '../../services/i.notification.service';
import { NIOTIFICATION_SERVICE } from 'src/app/service/notification.service';
import { NotificationHelper } from '../notification/notification.helper';

@Injectable({
  providedIn: 'root'
})
export class ReceiveNotificationService {
  private hubConnection!: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<{ id: number, message: string, read: boolean }[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(@Inject(NIOTIFICATION_SERVICE) protected service: INotificationService, private messageService: NotificationHelper,) { }

  startConnection(userId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(BASE_HUB_URL)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      this.JoinUserGroup(userId);
      this.loadInitialNotifications(userId);
      this.listenForNotifications();
    }).catch(err => console.error('Error while starting SignalR:', err));
  }

  private loadInitialNotifications(userId: string) {
    this.service.getAll().then(notifications => this.notificationsSubject.next(notifications));
  }

  private listenForNotifications() {
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      const currentNotifications = this.notificationsSubject.getValue();
      this.notificationsSubject.next([...currentNotifications, { id: 0, message, read: false }]);
      this.messageService.showSuccess(message);
      console.log('geldi bana')
    });
  }

  JoinUserGroup(userId: string) {
    this.hubConnection.invoke('JoinUserGroup', userId)
      .catch(err => console.error('Error joining group:', err));
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
