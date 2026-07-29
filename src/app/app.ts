import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactComponent } from './presentation/sections/contact/contact.component';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './presentation/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContactComponent, CommonModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('teachlywebsite');
  protected isContactModalOpen = signal(false);

  toggleContactModal() {
    this.isContactModalOpen.set(!this.isContactModalOpen());
    if (this.isContactModalOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
