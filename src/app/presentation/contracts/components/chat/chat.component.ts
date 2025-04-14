import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContractSignalRService } from 'src/app/core/helpers/signalR/ContractSignalRService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() contractId: number;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  newMessage: string = '';
  localization: any;

  comments: any[];

  constructor(
    private service: ContractSignalRService
  ) { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.service.startConnection(this.contractId.toString());
    this.service.comments$.subscribe(comments => {
      this.comments = comments;
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.service.sendComment(this.contractId, this.newMessage);
      this.newMessage = '';
    }
  }
}