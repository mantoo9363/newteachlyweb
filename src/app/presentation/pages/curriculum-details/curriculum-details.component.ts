import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { IframeEmbedComponent } from '../../components/iframe-embed/iframe-embed.component';
import { ApiService } from '../../../core/services/api-service';
import { PlanAccessService } from '../../../core/services/plan-access.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-curriculum-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent, IframeEmbedComponent],
  templateUrl: './curriculum-details.component.html',
  styleUrls: ['./curriculum-details.component.scss']
})
export class CurriculumDetailsComponent implements OnInit {

  @ViewChild(HeaderComponent) headerComponent?: HeaderComponent;

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private apiService: ApiService,
  private planAccess: PlanAccessService,
  private toastService: ToastService
) {}


  message = '';
showMessageModal = false;
openMessage(message: string) {
    this.message = message;
    this.showMessageModal = true;
  }

  closeMessage() {
    this.showMessageModal = false;
  }

   
  id: string | null = null;
  title: string | null = null;
  moduleData: any = null;
  selectedLecture: any = null;
  expandedSections = signal<string | null>(null);
  isSubscribed = false; // Video access lock flag
  showIframe = false; // Control iframe visibility
  iframeUrl = ''; // URL to embed in iframe
  simulationModules: { id: string; name: string; url: string }[] = []; // Available simulation modules
  studentsCount = '';
  private readonly aiIframeLoginCookie = 'teachly_ai_logged_in';
  private readonly simulatorUrls = environment.simulatorUrls;

  private allModules: { [key: string]: any } = {
    '10': {
      headline: 'Robotics & 3D CAD LAB',
      subHeadline: 'From Circuits to 3D Models — Build Real-World Products',
      description: 'Learn how engineers think by building electronic circuits, then creating and modifying 3D models in a simple, browser-based environment.',
      whatYouDo: [
        'Build and test simple electronic circuits',
        'Connect components like resistors, LEDs, and switches',
        'Create 3D objects like cubes, spheres, and structures',
        'Resize, scale, and modify designs in real-time',
        'Build components that can be used in real systems'
      ],
      howItWorks: 'Start with circuit basics → build and test connections → move into 3D modeling → combine shapes → create usable designs. No prior experience needed.',
      whyThisMatters: {
        intro: 'Most students only see designs. Here, you actually build them — starting with the electronics that make them work.',
        points: [
          'Understand core electronics and circuit logic',
          'Understand product design fundamentals',
          'Visualize ideas in 3D',
          'Develop problem-solving through design thinking'
        ]
      },
      whatYouLearn: [
        'Circuit building and electronics basics',
        '3D modeling basics',
        'Spatial understanding',
        'Design logic used in real industries'
      ],
      outcome: 'By the end, you won’t just understand design—you’ll be able to create it yourself.',
      video: '/image/CAD DEMO.mp4',
      image: '/image/CAD_IMAGE.png',
      playUrl: this.simulatorUrls.circuit,
      lessons: '450+  ',
      rating: '10',
      students: '20K'
    },
   
    '12': {
      headline: 'DRONE SIMULATION MODULE',
      subHeadline: 'Design, Build, and Fly Drones — Virtually',
      description: 'Experience how drones work by assembling components and controlling them in a simulated environment.',
      whatYouDo: [
        'Select drone components',
        'Assemble your own drone',
        'Control movement (Pitch, Roll, Yaw)',
        'Run simulation-based scenarios'
      ],
      howItWorks: 'Choose parts → assemble drone → control behavior → test performance.',
      whyThisMatters: {
        intro: 'Real drones are expensive, risky to operate, and not accessible to most students. This removes all those barriers.',
        points: [
          'Expensive',
          'Risky to operate',
          'Not accessible to most students'
        ]
      },
      whatYouLearn: [
        'Drone mechanics and control systems',
        'Flight dynamics basics',
        'System integration (hardware + logic)'
      ],
      outcome: 'You gain real understanding of how drones are built and controlled—without ever needing physical hardware.',
      video: '/image/Drone Demo.mp4',
      image: '/image/DRONE_IMAGE.png',
      playUrl: this.simulatorUrls.droneDownload,
      lessons: '30+',
      rating: '10',
      students: '20k'
    },
   '13': {
  headline: 'AI LEARNING MODULE',
  subHeadline: 'Unlock the Power of Artificial Intelligence',
  description:
    'Master the fundamentals of AI by training models and understanding how machines process information.',

  whatYouDo: [
    'Understand AI Foundation & Real Meanings',
    'Master Prompt Engineering Techniques',
    'Learn Text, Image, Video & Voice AI Tools',
    'Explore Business Automation & No-Code AI',
    'Earning Opportunities & Freelancing with AI',
    'Build Real-world AI Projects & Portfolios'
  ],

// learningLevels: [
//   {
//     level: 'LEVEL 1',
//     title: 'AI Explorer',
//     lessons: 4,
//     outcomes: [
//       'Understand the fundamentals of Artificial Intelligence.',
//       'Learn Prompt Engineering.',
//       'Use modern AI tools.',
//       'Build a strong AI foundation.'
//     ]
//   },
//   {
//     level: 'LEVEL 2',
//     title: 'AI Foundations',
//     lessons: 5,
//     outcomes: [
//       'Python for AI',
//       'Machine Learning',
//       'Deep Learning',
//       'Student Performance Predictor',
//       'AI Model Basics'
//     ]
//   },
//   {
//     level: 'LEVEL 3',
//     title: 'AI Engineer',
//     lessons: 5,
//     outcomes: [
//       'LLMs',
//       'Generative AI',
//       'AI Agents',
//       'MLOps',
//       'Deploy AI Applications'
//     ]
//   }
// ],

  howItWorks:
    'Learn AI → Build Projects → Deploy AI Applications → Become Industry Ready.',

  whyThisMatters: {
    intro:
      'Artificial Intelligence is transforming every industry. Learning AI today prepares students for tomorrow’s careers.',
    points: [
      'Build future-ready AI skills',
      'Learn through hands-on projects',
      'Prepare for AI careers',
      'Become industry ready'
    ]
  },

  whatYouLearn: [
    'Artificial Intelligence',
    'Prompt Engineering',
    'Python Programming',
    'Machine Learning',
    'Deep Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Generative AI',
    'AI Agents',
    'MLOps',
    'AI Deployment'
  ],

  outcome:
    'Understand core AI concepts and principles, Build and apply AI solutions through hands-on projects, Develop industry-ready AI engineering skills',

  video: '/video/AI COURSE-20260511T100451Z-3-001/AI COURSE/1.Intro To AI Pro Series.mp4',

  image: '/image/AI Learning.jpeg',

  playUrl: this.simulatorUrls.ai,

  lessons: '30+',
  rating: '10',
  students: '20k',
  hidePreviewControls: true
},
  };

 

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.queryParams.subscribe(params => {
      window.scrollTo(0, 0);
      const nextId = params['id'] ?? null;
      const isModuleChange = this.id !== nextId;

      if (isModuleChange) {
        this.showIframe = false;
        this.iframeUrl = '';
      }

      this.id = nextId;
      this.title = params['title'];
      this.isSubscribed = this.planAccess.hasPlanGroupAccess('tech');

      if (this.id && this.allModules[this.id]) {
        this.moduleData = this.allModules[this.id];
        // Don't auto-select first lecture so module intro video plays first
        this.selectedLecture = null;
        this.studentsCount = this.generateRandomStudentsCount();
        if (isModuleChange) {
          this.reloadModulePreviewVideo();
        }
      }

      // Populate simulation modules
      this.populateSimulationModules();

      console.log('Curriculum Details - ID:', this.id);
      console.log('Curriculum Details - Title:', this.title);
      console.log('Module Data:', this.moduleData);
    });
  }

  private generateRandomStudentsCount(): string {
    const count = Math.floor(Math.random() * (20 - 2 + 1)) + 2;
    return `${count}k`;
  }

  private reloadModulePreviewVideo(): void {
    // Defer until Angular has updated the <source> src for the new module
    setTimeout(() => {
      const videoElement = document.querySelector('.module-video') as HTMLVideoElement | null;
      videoElement?.load();
    });
  }

  private populateSimulationModules(): void {
    this.simulationModules = Object.entries(this.allModules)
      .filter(([key, module]) => module.playUrl)
      .map(([key, module]) => ({
        id: key,
        name: module.headline,
        url: module.playUrl
      }));
  }

  selectLecture(lecture: any): void {
    if (!this.isSubscribed) {
      this.selectedLecture = lecture;
      // Scroll to video section to show the lock/info
      document.querySelector('.video-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.selectedLecture = lecture;
    const videoElement = document.querySelector('.module-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.load();
      videoElement.play();
    }
    // Scroll to video section
    document.querySelector('.video-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  unlockContent(): void {
    window.open('https://aitraining.theteachly.com/', '_blank');
  }

  scrollToSection(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getHowItWorksSteps(text: string): { steps: string[], note: string } {
    if (!text) return { steps: [], note: '' };
    const parts = text.split('→').map(s => s.trim());
    let note = '';

    const lastPart = parts[parts.length - 1];
    const dotIndex = lastPart.indexOf('.');
    if (dotIndex !== -1 && dotIndex < lastPart.length - 1) {
      note = lastPart.substring(dotIndex + 1).trim();
      parts[parts.length - 1] = lastPart.substring(0, dotIndex + 1).trim();
    }

    return { steps: parts, note };
  }

  /*launchSimulation(): void {
    if (this.moduleData && this.moduleData.playUrl) {
      this.iframeUrl = this.moduleData.playUrl;
      this.showIframe = true;
      window.scrollTo(0, 0);
    }
  }*/


  launchSimulation(): void {

  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const userId = Number(sessionStorage.getItem('user_id') || localStorage.getItem('user_id'));

 // console.log(token);

  if (!token) {

    this.headerComponent?.openModal('login');

    return;
  }

  if (userId) {
    this.apiService.getSchoolPaymentHistory(userId).subscribe({
      next: (payments) => {
        if (!this.hasActiveTechPayment(payments)) {
          this.blockSimulationAccess();
          return;
        }

        this.openSimulationAfterAccessCheck(token);
      },
      error: (err) => {
        console.error(err);
        if (!this.canOpenSimulation()) {
          this.blockSimulationAccess();
          return;
        }

        this.openSimulationAfterAccessCheck(token);
      }
    });
    return;
  }

  if (!this.canOpenSimulation()) {
    this.blockSimulationAccess();
    return;
  }

  this.openSimulationAfterAccessCheck(token);
}

  private openSimulationAfterAccessCheck(token: string): void {
  if (this.id === '13' && this.hasAiIframeLoginCookie()) {
    this.iframeUrl = this.moduleData.playUrl;
    this.showIframe = true;
    window.scrollTo(0, 0);
    return;
  }

  if (this.id === '12') {
    window.location.href = this.simulatorUrls.droneDownload;
    return;
  }

this.apiService.generateTempToken().subscribe({
  
  next: (res) => {
    const token = res.temp_token;
   // console.log(token);

    this.iframeUrl =
      `${this.moduleData.playUrl}?token=${encodeURIComponent(token)}`;
    this.showIframe = true;
    window.scrollTo(0, 0);
  },
  error: (err) => {
    console.error(err);
    if (token && !sessionStorage.getItem('access_token')) {
      sessionStorage.setItem('access_token', token);
    }
    this.toastService.show('Simulation could not start. Please try again.', 'error');
  }
});





    // console.log(token);

 //window.location.href =
   // `${this.moduleData.playUrl}?token=${encodeURIComponent(token)}`;

    //console.log(window.location.href);

}

  private blockSimulationAccess(): void {
    this.showIframe = false;
    this.iframeUrl = '';
    this.toastService.show('Please upgrade to the Tech Education Plan to access Simulation and Download.', 'error');
  }

  private canOpenSimulation(): boolean {
    this.isSubscribed = this.planAccess.hasPlanGroupAccess('tech');
    return this.isSubscribed;
  }

  private hasActiveTechPayment(payments: any): boolean {
    const activePayments = Array.isArray(payments)
      ? payments.filter((payment: any) => payment?.is_active && !this.isPackageExpired(payment?.expires_at))
      : [];

    return activePayments.some((payment: any) => {
      const planKey = this.normalizePlanKey(payment?.active_package_key || payment?.plan_name || payment?.course);
      return planKey === 'tech' || planKey === 'combo';
    });
  }

  private normalizePlanKey(plan: string | null | undefined): string | null {
    const normalized = plan?.trim().toLowerCase();
    if (!normalized) return null;

    if (['tech', 'tech plan', 'tech education plan'].includes(normalized)) return 'tech';
    if (['combo', 'tech & smart', 'tech and smart', 'tech & smart education plan'].includes(normalized)) return 'combo';
    if (['smart', 'smart plan', 'smart education plan'].includes(normalized)) return 'smart';

    return null;
  }

  private isPackageExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    const expiryTime = Date.parse(expiresAt);
    return Number.isFinite(expiryTime) && expiryTime <= Date.now();
  }

  private hasAiIframeLoginCookie(): boolean {
    return document.cookie
      .split(';')
      .some((cookie) => cookie.trim() === `${this.aiIframeLoginCookie}=true`);
  }

  closeIframe(): void {
    this.showIframe = false;
    this.iframeUrl = '';
    window.scrollTo(0, 0);
  }

  private moduleCategory(): string {
    const categories: { [key: string]: string } = {
      '10': 'Robotics',
      '12': 'Drone',
      '13': 'AI'
    };
    return (this.id && categories[this.id]) || 'Drone';
  }

  goToTutorial(): void {
    // The tutorial page itself resolves the category to an actual lesson id
    // (and handles the login/plan gating) - this button just has to navigate.
    this.router.navigate(['/tutorial/category', this.moduleCategory()]);
  }

  switchModule(moduleId: string): void {
    if (this.allModules[moduleId] && this.allModules[moduleId].playUrl) {
      this.id = moduleId;
      this.moduleData = this.allModules[moduleId];
      this.iframeUrl = this.moduleData.playUrl;
      this.studentsCount = this.generateRandomStudentsCount();
      this.selectedLecture = null;
      this.reloadModulePreviewVideo();
    }
  }
}
