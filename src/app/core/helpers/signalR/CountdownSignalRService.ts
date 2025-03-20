import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BASE_HUB_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountdownSignalRService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(BASE_HUB_URL) // SignalR hub URL
      .build();
  }

  startConnection(): Promise<void> {
    return this.hubConnection
      .start()
      .catch(err => console.error('SignalR bağlantısı hatası:', err));
  }

  joinGroup(requestId: string): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return this.hubConnection
        .invoke('JoinGroup', requestId)
        .catch(err => console.error('JoinGroup hatası:', err));
    } else {
      return Promise.reject('');
    }
  }

  leaveGroup(requestId: string): void {
    this.hubConnection
      .invoke('LeaveGroup', requestId)
      .catch(err => console.error('LeaveGroup error:', err));
  }

  triggerStartCountdown(requestId: string): void {
    this.hubConnection
      .invoke('StartCountdown', requestId)
      .catch(err => console.error('StartCountdown error:', err));
  }

  onStartCountdown(callback: () => void): void {
    this.hubConnection.on('StartCountdown', callback);
  }

  onChangeStatu(callback: () => void): void {
    this.hubConnection.on('ChangeStatu', callback);
  }

  onRemainingTimeUpdate(callback: (remainingTime: number) => void): void {
    this.hubConnection.on('UpdateRemainingTime', callback);
  }

  onChangePrice(callback: () => void): void {
    this.hubConnection.on('ChangePrice', callback);
  }
}
