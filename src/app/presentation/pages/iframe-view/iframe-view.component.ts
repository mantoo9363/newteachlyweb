import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-iframe-view',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './iframe-view.component.html',
  styleUrls: ['./iframe-view.component.scss']
})
export class IframeViewComponent implements OnInit {
  externalUrl: SafeResourceUrl | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const url = params['url'];
      if (url) {
        try {
          this.externalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(decodeURIComponent(url));
        } catch (error) {
          this.hasError = true;
          this.errorMessage = 'Invalid URL provided';
          this.isLoading = false;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  onIframeLoad(): void {
    this.isLoading = false;
  }

  onIframeError(): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = 'Failed to load the external content. Please try again.';
  }

  closeIframe(): void {
    this.router.navigate(['/']);
  }

  openInNewTab(): void {
    const url = this.route.snapshot.queryParams['url'];
    if (url) {
      window.open(decodeURIComponent(url), '_blank');
    }
  }
}
