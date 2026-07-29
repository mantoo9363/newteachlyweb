import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offer-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offer-popup.component.html',
  styleUrl: './offer-popup.component.scss'
})
export class OfferPopupComponent implements OnInit {
  isVisible = signal(false);

  name = '';
  whatsapp = '';

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const hasSeenPopup = sessionStorage.getItem('hasSeenOfferPopup');
      if (!hasSeenPopup) {
        this.showPopup();
        sessionStorage.setItem('hasSeenOfferPopup', 'true');
      }
    }
  }

  showPopup() {
    this.isVisible.set(true);
  }

  closePopup() {
    this.isVisible.set(false);
  }

  onSubmit() {
    console.log('Form submitted:', { name: this.name, whatsapp: this.whatsapp });
    // Handle form submission logic here
    this.closePopup();
  }
}
