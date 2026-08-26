import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  isModalOpen = false;
  activeIndex = 0;
  intervalId: any;

  heroContent = [
    {
      badge: 'AI Doubt Solver — Founding Member Offer',
      title: "Secure your future with India's first complete learning platform",
      description: "The most complete STEM platform with instant AI-powered doubt assistance.",
      btnText: 'See More',
      theme: 'founding',
      image: 'image/f940109b-4c2e-48e1-bcb6-cb1d8156b2d2.png',
      link: '/curriculum-details?id=13&title=AI Learning Module'
    },
    {
      badge: 'Launch Offer — AI Tutor Included',
      title: "Master AI + Drone + Robotics via virtual lab",
      description: "Join India's first AI-powered learning batch with 24/7 doubt solving. Limited spots!",
      btnText: 'See More',
      theme: 'launch',
      image: 'image/b3966317-198c-4422-97dc-d8f0986145db.png',
      link: '/curriculum-details?id=12&title=Drone Simulation Module'
    },
    {
      type: 'platform-overview',
      theme: 'overview'
    }
  ];

  platformFeatures = [
    {
      title: 'AI + Drone',
      desc: 'Simulator-based Class 9 — College',
      highlight: 'India First ✦',
      theme: 'purple-box',
      position: 'top-left'
    },
    {
      title: 'Ask Doubt 24/7',
      desc: 'AI Teacher Avatar 30 seconds answer',
      highlight: 'Always online ●',
      theme: 'purple-box',
      position: 'mid-left'
    },
    {
      title: 'Languages',
      desc: 'French · German Japanese · Spanish',
      highlight: 'For all learners',
      theme: 'blue-box',
      position: 'bottom-left'
    },
    {
      title: 'STEM Labs',
      desc: '50+ experiments CBSE · ICSE · UP',
      highlight: 'Class 9 to 12',
      theme: 'green-box',
      position: 'top-right'
    },
    {
      title: 'Exam Prep',
      desc: 'JEE · NEET · UPSC Competitive exams',
      highlight: 'All boards covered',
      theme: 'orange-box',
      position: 'mid-right'
    },
    {
      title: 'Entrepreneurship',
      desc: 'Startup skills Business thinking',
      highlight: 'Class 5 to College',
      theme: 'green-box',
      position: 'bottom-right'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.startSlider();
  }

  ngAfterViewInit(): void {
    this.attemptAutoplay();
  }

  attemptAutoplay(): void {
    if (this.heroVideo?.nativeElement) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.play().catch(err => {
        console.warn('Autoplay failed:', err);
      });
    }
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  startSlider(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopSlider(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.heroContent.length;
    this.playVideo();
  }

  setSlide(index: number): void {
    this.activeIndex = index;
    this.stopSlider();
    this.startSlider();
    this.playVideo();
  }

  private playVideo(): void {
    setTimeout(() => {
      this.attemptAutoplay();
    }, 100);
  }

  openVideoModal(): void {
    this.isModalOpen = true;
    setTimeout(() => {
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.play();
      }
    }, 100);
  }

  closeVideoModal(): void {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0;
    }
    this.isModalOpen = false;
  }

  onOverlayClick(event: MouseEvent | TouchEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('video-modal-overlay')) {
      this.closeVideoModal();
    }
  }

  onBtnClick(item: any): void {
    if (item.link) {
      if (item.link.startsWith('http')) {
        window.open(item.link, '_blank');
      } else {
        const [path, query] = item.link.split('?');
        const queryParams: any = {};
        if (query) {
          query.split('&').forEach((param: string) => {
            const [key, value] = param.split('=');
            queryParams[key] = decodeURIComponent(value);
          });
        }
        this.router.navigate([path], { queryParams });
      }
    } else {
      this.scrollToSection('courses');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
