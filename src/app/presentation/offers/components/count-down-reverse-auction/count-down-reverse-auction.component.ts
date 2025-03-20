import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownSignalRService } from 'src/app/core/helpers/signalR/CountdownSignalRService';

@Component({
    selector: 'app-count-down-reverse-auction',
    templateUrl: './count-down-reverse-auction.component.html',
    styleUrls: ['./count-down-reverse-auction.component.scss']
})
export class CountDownReverseAuctionComponent implements OnChanges {
    @Input() initialMinutes: number = 0;

    hours: number = 0;
    minutes: number = 0;
    seconds: number = 0;
    totalSeconds: number = 0;
    intervalId: any;
    isRunning: boolean = false;

    requestId: string;

    constructor(  private route: ActivatedRoute,private cdr: ChangeDetectorRef, private signalRService: CountdownSignalRService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['initialMinutes'] && changes['initialMinutes'].currentValue > 0) {
            this.calculateInitialValues();
        }
    }

    ngOnInit(): void {
        this.requestId = this.route.snapshot.paramMap.get('id') || ''; // URL'den requestId al
        this.signalRService.startConnection().then(() => {
            return this.signalRService.joinGroup(this.requestId);
          })
          
        this.signalRService.onRemainingTimeUpdate((remainingTime: number) => {
            this.totalSeconds = remainingTime;
            this.updateTimer(remainingTime);
          });
      
    }

    private calculateInitialValues(): void {
        this.totalSeconds = this.initialMinutes;
        this.updateTimer(this.totalSeconds);
    }


    private updateTimer(totalSeconds: number): void {
        this.hours = Math.floor(totalSeconds / 3600);
        const remainingSecondsAfterHours = totalSeconds % 3600;
        this.minutes = Math.floor(remainingSecondsAfterHours / 60);
        this.seconds = remainingSecondsAfterHours % 60;

        this.cdr.detectChanges();
    }

    getSeconds(): number {
        return this.totalSeconds;
    }

    resetTimer(): void {
        this.calculateInitialValues();
    }

    formatValue(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    getFormattedCount(value: number): string {
        return this.formatValue(value);
    }
}
