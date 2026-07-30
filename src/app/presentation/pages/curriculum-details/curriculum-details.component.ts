import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { IframeEmbedComponent } from '../../components/iframe-embed/iframe-embed.component';
import { ApiService } from '../../../core/services/api-service';


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
  private apiService: ApiService
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
  private readonly aiIframeLoginCookie = 'teachly_ai_logged_in';

  private allModules: { [key: string]: any } = {
    '10': {
      headline: 'Robotics & 3D CAD LAB',
      subHeadline: 'Design Real-World Products — From Scratch',
      description: 'Learn how engineers think by creating and modifying 3D models in a simple, browser-based CAD environment.',
      whatYouDo: [
        'Create 3D objects like cubes, spheres, and structures',
        'Resize, scale, and modify designs in real-time',
        'Build components that can be used in real systems'
      ],
      howItWorks: 'Start with basic shapes → modify them → combine them → create usable designs. No prior experience needed.',
      whyThisMatters: {
        intro: 'Most students only see designs. Here, you actually build them.',
        points: [
          'Understand product design fundamentals',
          'Visualize ideas in 3D',
          'Develop problem-solving through design thinking'
        ]
      },
      whatYouLearn: [
        '3D modeling basics',
        'Spatial understanding',
        'Design logic used in real industries'
      ],
      outcome: 'By the end, you won’t just understand design—you’ll be able to create it yourself.',
      video: '/image/CAD DEMO.mp4',
      image: '/image/CAD_IMAGE.png',
      // playUrl: 'https://circuit.theteachly.com'
       playUrl: 'http://localhost:3001'
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
      playUrl: 'https://drone.theteachly.com'
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

learningLevels: [
  {
    level: 'LEVEL 1',
    title: 'AI Explorer',
    lessons: 4,
    outcomes: [
      'Understand the fundamentals of Artificial Intelligence.',
      'Learn Prompt Engineering.',
      'Use modern AI tools.',
      'Build a strong AI foundation.'
    ]
  },
  {
    level: 'LEVEL 2',
    title: 'AI Foundations',
    lessons: 5,
    outcomes: [
      'Python for AI',
      'Machine Learning',
      'Deep Learning',
      'Student Performance Predictor',
      'AI Model Basics'
    ]
  },
  {
    level: 'LEVEL 3',
    title: 'AI Engineer',
    lessons: 5,
    outcomes: [
      'LLMs',
      'Generative AI',
      'AI Agents',
      'MLOps',
      'Deploy AI Applications'
    ]
  }
],

  howItWorks:
    'Learn AI → Build Projects → Deploy AI Applications → Become Industry Ready.',

  whyThisMatters: {
    intro:
      'Artificial Intelligence is transforming every industry. Learning AI today prepares students for tomorrow’s careers.',
    points: [
      'Master future-ready AI skills',
      'Learn through hands-on projects',
      'Become industry ready',
      'Build an impressive AI portfolio'
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
    'Complete your journey from AI Explorer to AI Engineer by building production-ready AI applications and becoming industry ready.',

  video: '/video/AI COURSE-20260511T100451Z-3-001/AI COURSE/1.Intro To AI Pro Series.mp4',

  image: '/image/AI Learning.jpeg',

  playUrl: 'http://localhost:3000/'
  // playUrl: 'https://aiab.theteachly.com/'
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

      if (this.id && this.allModules[this.id]) {
        this.moduleData = this.allModules[this.id];
        // Don't auto-select first lecture so module intro video plays first
        this.selectedLecture = null;
      }

      // Populate simulation modules
      this.populateSimulationModules();

      console.log('Curriculum Details - ID:', this.id);
      console.log('Curriculum Details - Title:', this.title);
      console.log('Module Data:', this.moduleData);
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

  const token = sessionStorage.getItem('access_token');

 // console.log(token);

  if (!token) {

    this.headerComponent?.openModal('login');

    return;
  }

  if (this.id === '13' && this.hasAiIframeLoginCookie()) {
    this.iframeUrl = this.moduleData.playUrl;
    this.showIframe = true;
    window.scrollTo(0, 0);
    return;
  }

  if (this.id === '10') {
    this.iframeUrl = this.moduleData.playUrl;
    this.showIframe = true;
    window.scrollTo(0, 0);
    return;
  }

this.apiService.generateTempToken().subscribe({
  
  next: (res) => {
    const token = res.temp_token;
   // console.log(token);

    this.iframeUrl = this.buildIframeUrl(this.moduleData.playUrl, { token });
    this.showIframe = true;
    window.scrollTo(0, 0);
  },
  error: (err) => {
    console.error(err);
    if (token && !sessionStorage.getItem('access_token')) {
      sessionStorage.setItem('access_token', token);
    }
    this.openMessage('Simulation could not start. Please try again.');
  }
});





  // console.log(token);

 //window.location.href =
   // `${this.moduleData.playUrl}?token=${encodeURIComponent(token)}`;

    //console.log(window.location.href);

}

  private buildIframeUrl(baseUrl: string, params: Record<string, string>): string {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
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

  switchModule(moduleId: string): void {
    if (this.allModules[moduleId] && this.allModules[moduleId].playUrl) {
      this.id = moduleId;
      this.moduleData = this.allModules[moduleId];
      this.iframeUrl = this.moduleData.playUrl;
    }
  }
}
