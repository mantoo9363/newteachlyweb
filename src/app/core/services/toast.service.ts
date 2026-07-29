import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toast = signal<Toast | null>(null);
  private timeout: any;

  show(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    clearTimeout(this.timeout);
    this.toast.set({ message, type });
    this.timeout = setTimeout(() => this.toast.set(null), duration);
  }

  hide(): void {
    clearTimeout(this.timeout);
    this.toast.set(null);
  }
}
