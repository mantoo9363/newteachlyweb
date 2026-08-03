import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent {

  pdfUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const file = this.route.snapshot.queryParamMap.get('file');

    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      file + '#toolbar=0&navpanes=0&scrollbar=0'
    );
  }
}