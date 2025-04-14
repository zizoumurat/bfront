import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Contract_SERVICE } from 'src/app/service/contract.service';
import { BASE_HUB_URL } from 'src/environments/environment';
import { IContractService } from '../../services/i.contract.service';

@Injectable({
  providedIn: 'root'
})
export class ContractSignalRService {
  private hubConnection!: signalR.HubConnection;
  private commentsSubject = new BehaviorSubject<{ user: string, message: string }[]>([]);
  comments$ = this.commentsSubject.asObservable();
  private apiUrl = BASE_HUB_URL
  
  constructor(@Inject(Contract_SERVICE) protected service: IContractService) {}

  startConnection(contractId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(BASE_HUB_URL)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      this.joinContractGroup(contractId);
      this.loadInitialComments(contractId);
      this.listenForComments();
    }).catch(err => console.error('Error while starting SignalR:', err));
  }

  private loadInitialComments(contractId: string) {
    this.service.getComments(+contractId).then(comments => this.commentsSubject.next(comments));
  }

  private listenForComments() {
    this.hubConnection.on('ReceiveComment', (user: string, message: string) => {
      const currentComments = this.commentsSubject.getValue();
      this.commentsSubject.next([...currentComments, { user, message }]);
    });
  }

  joinContractGroup(contractId: string) {
    this.hubConnection.invoke('JoinContractGroup', contractId)
      .catch(err => console.error('Error joining group:', err));
  }

  sendComment(contractId: number, message: string) {
    this.service.addComment({ comment: message, contractId });
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
