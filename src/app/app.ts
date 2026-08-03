import { Component, OnDestroy, OnInit, signal } from '@angular/core';
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
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('teachlywebsite');
  protected isContactModalOpen = signal(false);

  private tawkObserver?: MutationObserver;

  ngOnInit(): void {
    this.suppressTawkWidget();
  }

  ngOnDestroy(): void {
    this.tawkObserver?.disconnect();
  }

  toggleContactModal() {
    this.isContactModalOpen.set(!this.isContactModalOpen());
    if (this.isContactModalOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // The Tawk.to chat widget is injected by Google Tag Manager (not by this
  // app), so it can appear at any time after page load. CSS alone can't
  // reliably beat the inline styles Tawk sets on its own elements, so we
  // watch the DOM and remove/hide the widget the moment it shows up.
  private suppressTawkWidget(): void {
    const isTawkElement = (el: Element): boolean => {
      const id = el.id || '';
      const className = typeof el.className === 'string' ? el.className : '';
      const src = el.getAttribute?.('src') || '';
      return /tawk/i.test(id) || /tawk/i.test(className) || /tawk/i.test(src);
    };

    const removeTawkElements = (): void => {
      document.querySelectorAll('[id*="tawk" i], [class*="tawk" i], iframe[src*="tawk.to" i]')
        .forEach((el) => el.remove());
    };

    removeTawkElements();

    this.tawkObserver = new MutationObserver((mutations) => {
      let found = false;
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element && (isTawkElement(node) || node.querySelector('[id*="tawk" i], [class*="tawk" i], iframe[src*="tawk.to" i]'))) {
            found = true;
          }
        });
      }
      if (found) {
        removeTawkElements();
      }
    });

    this.tawkObserver.observe(document.body, { childList: true, subtree: true });
  }
}
