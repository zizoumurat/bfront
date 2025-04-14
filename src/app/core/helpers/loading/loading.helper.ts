import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadingHelper {
  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  constructor(private ngZone: NgZone) { }

  show() {
    if (this.loadingCount === 0) {
      this.displayLoading();
    }
    this.loadingCount++;
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount === 0) {
      this.hideLoading();
    }
  }

  private displayLoading() {
    this.loadingSubject.next(true);
  }

  private hideLoading() {
    this.loadingSubject.next(false);
  }
}
