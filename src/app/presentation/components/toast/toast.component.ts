import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.toast(); as t) {
    <div class="toast" [class]="t.type" (click)="toastService.hide()">
      <span class="toast-icon">
        @if (t.type === 'success') { ✔ }
        @else if (t.type === 'error') { ✕ }
        @else { ℹ }
      </span>
      <span class="toast-msg">{{ t.message }}</span>
    </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      animation: toastIn 0.35s ease;
      cursor: pointer;
      max-width: 90vw;
    }
    .toast.success { background: linear-gradient(135deg, #059669, #10b981); }
    .toast.error   { background: linear-gradient(135deg, #dc2626, #ef4444); }
    .toast.info    { background: linear-gradient(135deg, #7c3aed, #6366f1); }
    .toast-icon    { font-size: 18px; flex-shrink: 0; }
    .toast-msg     { white-space: nowrap; }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }
}
