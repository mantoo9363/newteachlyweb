import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chapter, CLASSES } from './ct-ai.data';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-ct-ai',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './ct-ai.component.html',
  styleUrls: ['./ct-ai.component.scss']
})
export class CtAiComponent {

  // All Classes
  classes = CLASSES;

  // Default Selected Class
  selectedClass = this.classes[0];

  constructor(private router: Router) {}

  /**
   * Change Active Class
   */
  selectClass(cls: any): void {
    this.selectedClass = cls;
  }

  /**
   * Total Chapters
   */
  get total(): number {
    return this.selectedClass.math.length + this.selectedClass.ai.length;
  }

  /**
   * Convert Number to 01,02,03...
   */
  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
  openPDF(chapter: any) {
  this.router.navigate(['/pdf-viewer'], {
    queryParams: {
      file: chapter.pdf
    }
  });
}
}



