import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-count-down',
    templateUrl: './count-down.component.html',
    styleUrl: './count-down.component.scss'
})

export class CountDownComponent {
    @Input() targetDate: Date;

    days: number = 0;
    hours: number = 0;
    minutes: number = 0;
    seconds: number = 0;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['targetDate']) {
            if (this.targetDate)
                this.calculateTimeLeft();
        }
    }

    private calculateTimeLeft(): void {
        if (!this.targetDate) return;

        this.targetDate = new Date(this.targetDate);
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            this.days = this.hours = this.minutes = this.seconds = 0;

            return;
        }

        this.cdr.detectChanges();

        setTimeout(() => { this.calculateTimeLeft() }, 6000);
    }

    formatValue(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    getFormattedCount(value) {
        return this.formatValue(value);
    }
}
