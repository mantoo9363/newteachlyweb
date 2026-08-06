import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
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

    const accessToken = this.authStorage.getToken();
    if (!accessToken) {
      this.setExternalUrl(environment.studentPanel.loginUrl);
      return;
    }

    const ssoUrl = this.buildStudentPanelSsoUrl(accessToken);
    this.authStorage.markStudentPanelSso();
    this.setExternalUrl(ssoUrl);
  }

  private safeDecodeUrl(url: string): string {
    try {
      return decodeURIComponent(url);
    } catch {
      return '';
    }
  }

  private isStudentPanelUrl(url: string): boolean {
    const studentPanelUrls = [
      environment.studentPanel.loginUrl,
      environment.studentPanel.ssoUrl,
      `${environment.urls.studentPanel}/auth/login`,
      `${environment.urls.studentPanel}/auth/sso`,
      `${environment.urls.productionStudentPanel}/auth/login`,
      `${environment.urls.productionStudentPanel}/auth/sso`,
    ];

    return studentPanelUrls.some((studentPanelUrl) => {
      const baseUrl = studentPanelUrl.split('?')[0];
      return url === baseUrl || url.startsWith(`${baseUrl}?`);
    });
  }

  private buildStudentPanelSsoUrl(token: string): string {
    const dashboardUrl = environment.studentPanel.loginUrl.replace(/\/auth\/login$/, '/dashboard');
    const params = new URLSearchParams({
      token,
      redirect: dashboardUrl,
    });

    return `${environment.studentPanel.ssoUrl}?${params.toString()}`;
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
