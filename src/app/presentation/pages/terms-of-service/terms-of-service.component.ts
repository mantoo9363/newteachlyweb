import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.scss'
})
export class TermsOfServiceComponent {}
