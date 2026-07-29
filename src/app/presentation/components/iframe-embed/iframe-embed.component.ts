import { Component, Input, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iframe-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iframe-embed.component.html',
  styleUrls: ['./iframe-embed.component.scss']
})
export class IframeEmbedComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() url!: string;
  @Input() title: string = 'External Content';
  @Input() modules: { id: string; name: string; url: string }[] = [];
  
  sanitizedUrl: SafeResourceUrl | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  loadTimeout: any;
  selectedModuleId: string = '';
  
  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    if (!this.url) {
      this.showError('No URL provided');
      return;
    }
    
    // Set initial selected module based on URL
    if (this.modules.length > 0) {
      const currentModule = this.modules.find(m => m.url === this.url);
      this.selectedModuleId = currentModule ? currentModule.id : this.modules[0].id;
    }
    
    this.loadUrl(this.url);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && changes['url'].currentValue !== changes['url'].previousValue) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  private loadUrl(url: string): void {
    try {
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.isLoading = true;
      this.hasError = false;
      
      // Reset timeout for new URL
      if (this.loadTimeout) {
        clearTimeout(this.loadTimeout);
      }
      this.loadTimeout = setTimeout(() => {
        if (this.isLoading) {
          this.showError(
            'The external content could not be loaded. This may be due to security restrictions (X-Frame-Options or Content-Security-Policy). ' +
            'Please try opening the link directly or contact support.'
          );
        }
      }, 10000);
      
      this.cdr.detectChanges();
    } catch (error) {
      this.showError('Invalid URL provided');
    }
  }
  
  ngAfterViewInit(): void {
    // Timeout is now handled in loadUrl method
  }
  
  ngOnDestroy(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
  }
  
  onIframeLoad(): void {
    this.isLoading = false;
    this.hasError = false;
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
    this.cdr.detectChanges();
  }
  
  onIframeError(): void {
    this.showError(
      'Failed to load external content. The website may not allow embedding.'
    );
  }
  
  private showError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
    this.cdr.detectChanges();
  }
  
  openInNewTab(): void {
    window.open(this.url, '_blank', 'noopener,noreferrer');
  }

  switchModule(moduleId: string): void {
    const module = this.modules.find(m => m.id === moduleId);
    if (module) {
      this.selectedModuleId = moduleId;
      this.isLoading = true;
      this.hasError = false;
      
      try {
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(module.url);
        this.url = module.url;
        
        // Reset timeout for new module
        if (this.loadTimeout) {
          clearTimeout(this.loadTimeout);
        }
        this.loadTimeout = setTimeout(() => {
          if (this.isLoading) {
            this.showError(
              'The external content could not be loaded. This may be due to security restrictions.'
            );
          }
        }, 10000);
        
        this.cdr.detectChanges();
      } catch (error) {
        this.showError('Invalid URL provided');
      }
    }
  }

  getSelectedModuleName(): string {
    const module = this.modules.find(m => m.id === this.selectedModuleId);
    return module ? module.name : this.title;
  }
}
