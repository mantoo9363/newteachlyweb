import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ApiService } from '../../../core/services/api-service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { environment } from '../../../../environments/environment';

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
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const url = params['url'];
      if (url) {
        this.loadIframeUrl(url);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private loadIframeUrl(url: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.externalUrl = null;

    const decodedUrl = this.safeDecodeUrl(url);
    if (!decodedUrl) {
      this.showError('Invalid URL provided');
      return;
    }

    if (!this.isStudentPanelUrl(decodedUrl)) {
      this.setExternalUrl(decodedUrl);
      return;
    }

    if (!this.authStorage.getToken()) {
      this.setExternalUrl(environment.studentPanel.loginUrl);
      return;
    }

    this.apiService.generateTempToken().subscribe({
      next: (res: any) => {
        const token = res?.temp_token;
        if (!token) {
          this.showError('Unable to start student session. Please try again.');
          return;
        }

        const ssoUrl = `${environment.studentPanel.ssoUrl}?token=${encodeURIComponent(token)}`;
        this.setExternalUrl(ssoUrl);
      },
      error: (error) => {
        console.error('Failed to create iframe SSO token:', error);
        this.showError('Unable to start student session. Please try again.');
      },
    });
  }

  private safeDecodeUrl(url: string): string {
    try {
      return decodeURIComponent(url);
    } catch {
      return '';
    }
  }

  private isStudentPanelUrl(url: string): boolean {
    return url === environment.studentPanel.loginUrl || url.startsWith(`${environment.studentPanel.ssoUrl}?`);
  }

  private setExternalUrl(url: string): void {
    this.externalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
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
      window.open(this.safeDecodeUrl(url), '_blank');
    }
  }
}
