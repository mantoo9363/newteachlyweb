import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  isExpanded: boolean = false;
  expandedSteps: Set<number> = new Set<number>();

  toggleReadMore() {
    this.isExpanded = !this.isExpanded;
  }

  toggleStep(index: number) {
    if (this.expandedSteps.has(index)) {
      this.expandedSteps.delete(index);
    } else {
      this.expandedSteps.add(index);
    }
  }

  isStepExpanded(index: number): boolean {
    return this.expandedSteps.has(index);
  }
}
