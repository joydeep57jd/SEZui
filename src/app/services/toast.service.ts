import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  classname: string;
  icon: string
  delay?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts$ = new BehaviorSubject<Toast[]>([]);
  detailedError$ = new BehaviorSubject<any>(null);

  showError(message: string) {
    const toasts = [...this.toasts$.getValue(), { message, classname: 'bg-danger text-light', icon: 'fa fa-times-circle' }]
    this.toasts$.next(toasts);
  }

  showSuccess(message: string) {
    const toasts = [...this.toasts$.getValue(), { message, classname: 'bg-success text-light', icon: 'fa fa-check-circle' }];
    this.toasts$.next(toasts);
  }

  showWarning(message: string) {
    const toasts = [...this.toasts$.getValue(), { message, classname: 'bg-warning text-light', icon: 'fa fa-exclamation-triangle' }];
    this.toasts$.next(toasts);
  }

  remove(index: number) {
    const toasts = this.toasts$.getValue();
    toasts.splice(index, 1);
    this.toasts$.next(toasts);
  }

  clear() {
    const toasts = this.toasts$.getValue();
    toasts.splice(0, toasts.length);
    this.toasts$.next(toasts);
  }
}
