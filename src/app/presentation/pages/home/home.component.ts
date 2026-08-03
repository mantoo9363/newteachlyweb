import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../../layout/header/header.component';
import { DashboardComponent } from '../../sections/dashboard/dashboard.component';
import { CurriculumComponent } from '../../sections/curriculum/curriculum.component';
import { FeedbackComponent } from '../../sections/feedback/feedback.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { CoursesComponent } from "../../sections/courses/courses.component";
import { PricingComponent } from '../../sections/pricing/pricing.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    DashboardComponent,
    CurriculumComponent,
    HeroComponent,
    FeedbackComponent,
    FooterComponent,
    CoursesComponent,
    PricingComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {

  constructor(private meta: Meta) {}

  @ViewChild(HeaderComponent)
  header!: HeaderComponent;

  @ViewChild('pricingSection')
  pricing!: ElementRef;

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: 'Teachly is a comprehensive STEM learning platform providing interactive simulations for students from elementary to university levels. Explore Physics, Chemistry, and more.'
    });

    this.updateCanonical('https://theteachly.com/');
    this.hideTawkChat();
  }

  openSignup(isSchool: boolean) {
    this.header.openModal('signup', isSchool);
  }

  scrollToPricing() {
    this.pricing.nativeElement.scrollIntoView({
      behavior: 'smooth'
    });
  }

  ngOnDestroy(): void {
    this.hideTawkChat();
  }

  private loadTawkChat(): void {
    // const win = window as any;

    // if (win.Tawk_API) {
    //   if (typeof win.Tawk_API.showWidget === 'function') {
    //     win.Tawk_API.showWidget();
    //   }
    //   return;
    // }

    // win.Tawk_API = win.Tawk_API || {};
    // win.Tawk_LoadStart = new Date();

    // const s1 = document.createElement("script");
    // const s0 = document.getElementsByTagName("script")[0];

    // s1.async = true;
    // s1.src = "https://embed.tawk.to/69eb0f9623ab1b1c3283ecaf/1jmv39pln";
    // s1.charset = "UTF-8";
    // s1.setAttribute("crossorigin", "*");

    // if (s0 && s0.parentNode) {
    //   s0.parentNode.insertBefore(s1, s0);
    // }
  }

  private hideTawkChat(): void {
    const win = window as any;

    if (win.Tawk_API && typeof win.Tawk_API.hideWidget === 'function') {
      win.Tawk_API.hideWidget();
    }
  }

  private updateCanonical(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}