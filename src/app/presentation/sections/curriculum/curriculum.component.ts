import { Component, HostListener, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { PopupService } from '../../../core/services/popup.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { AuthStorageService } from '../../../core/services/auth-storage.service';

register();

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CurriculumComponent implements OnInit {
  isDesktop = true;
  private readonly simulatorUrls = environment.simulatorUrls;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private popupService: PopupService,
    private toastService: ToastService,
    private authStorage: AuthStorageService,
  ) {}

  // The 3 individual plan states: Tech, Smart, and Combo (Tech & Smart together).
  // Combo appears in both groups since it unlocks the whole system. Mirrors
  // the same gating rules used in header.component.ts.
  private readonly planGroups: Record<'tech' | 'smart', string[]> = {
    tech: ['tech', 'combo'],
    smart: ['smart', 'combo'],
  };

  private readonly planGroupLabels: Record<'tech' | 'smart', string> = {
    tech: 'Tech Education Plan',
    smart: 'Smart Education Plan',
  };

  get isLoggedIn(): boolean {
    return this.authStorage.isLoggedIn();
  }

  private hasPurchasedPackage(): boolean {
    return this.authStorage.hasActivePackage();
  }

  private hasPlanGroupAccess(group: 'tech' | 'smart'): boolean {
    if (!this.hasPurchasedPackage()) return false;
    const activePlanKeys = this.authStorage.getActivePackageKeys();
    return activePlanKeys.some((planKey) => this.planGroups[group].includes(planKey));
  }

  isTopicAccessible(topic: any): boolean {
    if (!topic.requiresPlan) return true;
    return this.isLoggedIn && this.hasPlanGroupAccess(topic.requiresPlan);
  }

  private checkAccess(topic: any): boolean {
    if (!topic.requiresPlan) return true;

    if (!this.isLoggedIn) {
      this.popupService.openSignup();
      return false;
    }

    if (!this.hasPlanGroupAccess(topic.requiresPlan)) {
      this.toastService.show(
        `Upgrade to the ${this.planGroupLabels[topic.requiresPlan as 'tech' | 'smart']} to access this content.`,
        'error'
      );
      return false;
    }

    return true;
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isDesktop = window.innerWidth >= 1024;
  }

  comprehensiveModules = [
    {
      id: 10,
      icon: 'cube',
      color: '#0062FF',
      title: 'Robotics Virtual Lab Module',
      description:
        'Design and create 3D models directly in your browser using an easy-to-use CAD workspace. Learn how real-world products are designed by building and modifying objects step-by-step.',
      hasReadMore: true,
      playUrl: this.simulatorUrls.circuit,
      image: 'image/files/HD_01_CAD_Design_Module.png',
      btn:"Simulate Now",
      requiresPlan: 'tech',
    },
    {
      id: 12,
      icon: 'helicopter',
      color: '#ef4444',
      title: 'Drone Virtual Lab Module',
      description:
        'Assemble and control drones in a Virtual Lab environment. Learn how drones work, behave, and are controlled—without any physical risk.',
      hasReadMore: true,
      playUrl: this.simulatorUrls.droneDownload,
      image: 'image/files/HD_04_Drone_Simulation_Module.png',
      btn:"Download Now",
      requiresPlan: 'tech',

    },
    {
      id: 13,
      icon: 'robot',
      color: '#8b5cf6',
      title: 'AI Learning Module',
      description:
        'Master the fundamentals of Artificial Intelligence. Understand how machines learn, think, and solve complex problems through hands-on AI experiments.',
      hasReadMore: true,
      btn:"Simulate Now",
      playUrl: this.simulatorUrls.ai,
      image: 'image/files/HD_02_AI_Learning_Module.png',
      requiresPlan: 'tech',
    },
    {
      id: 7,
      icon: 'brain',
      color: '#f43f5e',
      title: '24/7 AI Doubt Solving',
      description:
        'Get instant, personalized support for any subject at any time. Our advanced AI tutor helps you overcome learning hurdles whenever they occur.',
      hasReadMore: true,
      image: 'image/files/HD_05_Ask_Doubt_Module.png',
      requiresPlan: 'smart',
    },
    {
      id: 1,
      icon: 'vr-cardboard',
      color: '#0062FF',
      title: 'Virtual Lab',
      description:
        'Experience immersive learning with our powered virtual labs that bring complex theories to life through interactive experiments.',
      hasReadMore: true,
      image: 'image/Simulator.png',
      requiresPlan: 'smart',
    },
  ];

  mainTopics = [
    {
      id: 2,
      icon: 'language',
      color: '#ff6b6b',
      title: 'Language Learning',
      description:
        'Master new languages with ease using our advanced AI tools, focusing on pronunciation, grammar, and conversational skills.',
      image: 'image/Flags.png',
      requiresPlan: 'smart',
    },
    {
      id: 4,
      icon: 'trophy',
      color: '#ffa502',
      title: 'Competitive Preparation',
      description:
        'Prepare for various competitive exams like Olympiads, NTSE, and more with our specialized coaching and mock tests.',
      image: 'image/Competitive exams.png',
      requiresPlan: 'smart',
    },

    {
      id: 14,
      icon: 'brain-circuit',
      color: '#8b5cf6',
      title: 'Cognitive skill',
      description:
        'Enhance critical thinking, problem-solving, and cognitive abilities through scientifically designed exercises and interactive challenges.',
      image: 'image/Cognitive.jpeg',
    },
    {
      id: 15,
      icon: 'child',
      color: '#10b981',
      title: 'Child Psychology',
      description:
        'Understand and support the mental and emotional development of children through expert insights and practical guidance.',
      image: 'image/Child-Psychology.jpeg',
    },
    // {
    //   id: 6,
    //   icon: 'user-tie',
    //   color: '#06b6d4',
    //   title: 'Career Counselling',
    //   description: 'Get expert guidance on future career paths, subject choices, and higher education opportunities tailored to your interests.'
    // },
    // {
    //   id: 8,
    //   icon: 'palette',
    //   color: '#8b5cf6',
    //   title: 'Skill & Hobby Courses',
    //   description: 'Explore a wide range of skill-based and hobby courses from painting and music to technical and industrial skills.'
    // },
    // {
    //   id: 9,
    //   icon: 'lightbulb',
    //   color: '#10b981',
    //   title: 'Entrepreneurship Courses',
    //   description: 'Learn the fundamentals of building a business, from project reports and industrial documentaries to innovative business ideas.'
    // }
  ];

  onReadMore(topic: any): void {
    if (!this.checkAccess(topic)) return;

    if (topic.id === 1) {
      this.router.navigate(['/simulator']);
      return;
    }

    if (topic.id === 15) {
      this.router.navigate(['/child-psychology']);
      return;
    }

    if (topic.id === 14) {
      this.router.navigate(['/cognitive-skill-profile']);
      return;
    }

    if (topic.id === 2) {
      this.router.navigate(['/iframe-view'], {
        queryParams: {
          url: encodeURIComponent(
            'https://zenai.theteachly.com/school-courses/orientation-courses',
          ),
        },
      });
      return;
    }

    if (topic.id === 7) {
      window.open('http://localhost:65134/auth/login', '_blank');
      return;
    }

    if ([4, 6, 8, 9].includes(topic.id)) {
      this.router.navigate(['/iframe-view'], {
        queryParams: {
          url: encodeURIComponent('https://zenai.theteachly.com/'),
        },
      });
      return;
    }

    this.router.navigate(['/curriculum-details'], {
      queryParams: {
        id: topic.id,
        title: topic.title,
      },
    });
  }

  onPlay(topic: any, event: Event): void {
    event.stopPropagation();
    if (!this.checkAccess(topic)) return;

    if (this.isDesktop && topic.playUrl) {
      window.open(topic.playUrl, '_blank');
    }
  }
}
