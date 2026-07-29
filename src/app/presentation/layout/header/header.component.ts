import {
  Component,
  signal,
  OnInit,
  NgZone,
  inject,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api-service';
import { PopupService } from '../../../core/services/popup.service';
import { ToastService } from '../../../core/services/toast.service';

const LANGUAGE_MAP: { [key: string]: string } = {
  ENG: 'en',
  HIN: 'hi',
  BEN: 'bn',
  TEL: 'te',
  MAR: 'mr',
  TAM: 'ta',
  GUJ: 'gu',
  URD: 'ur',
  KAN: 'kn',
  MAL: 'ml',
  ORI: 'or',
  PAN: 'pa',
  ASM: 'as',
  NEP: 'ne',
  SAI: 'sa',
  SIN: 'sd',
  KON: 'kok',
  DOG: 'doi',
  MAI: 'mai',
  MAN: 'mni',
  KAS: 'ks',
};

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmNewPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showPaymentPopup: boolean = false;

  paymentSummary: any = {
    schoolId: '',
    schoolName: '',
    planKey: '',
    planName: '',
    taxableAmount: 0,
    gstAmount: 0,
    totalAmount: 0,
    planMonths: 1,
    couponCode: null,
  };
  isPaymentProcessing = false;
  selectedLanguage: string = '';
  headermsg: string = '';
  mobileMenuOpen = signal(false);
  expandedSections = signal<string | null>(null);
  expandedItems = signal<string | null>(null);
  activeDropdown = signal<string | null>(null);
  activeSubDropdown = signal<string | null>(null);
  isSignupOpen = false;
  activeTab: 'login' | 'signup' = 'signup';
  showMessageModal = false;
  userMenuOpen = false;
  showLoginPassword = false;
  showSignupPassword = false;
  showConfirmPassword = false;

  isProfileOpen = false;
  isChangePasswordOpen = false;
  isProfileLoading = false;
  profileData: any = null;
  profileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  message = '';
  // 🔹 Dynamic Data
  boardList: any[] = [];
  classList: any[] = [];
  fullApiData: any[] = []; // ✅ IMPORTANT
  @Output() scrollToPricing = new EventEmitter<void>();
  isSchoolSignup = false;

  selectedBoardId: number | any = null;
  loginForm!: FormGroup;
  signupForm!: FormGroup; // Search state
  isSearchModalOpen = signal(false);
  searchQuery = signal('');
  public service = inject(ApiService);
  private readonly signupDraftStorageKey = 'teachly_signup_draft';
  private isRestoringSignupDraft = false;
  get filteredSearchItems() {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    const results: any[] = [];

    // Flatten navigation menu
    this.navigationMenu.forEach((menu) => {
      if (menu.type === 'link') {
        if (menu.title.toLowerCase().includes(query)) {
          results.push({ title: menu.title, url: menu.url });
        }
      } else if (menu.items) {
        menu.items.forEach((item: any) => {
          if (item.type === 'nested-dropdown') {
            item.items.forEach((subItem: any) => {
              if (subItem.title.toLowerCase().includes(query)) {
                results.push({
                  title: `${menu.title} > ${item.title} > ${subItem.title}`,
                  url: subItem.url,
                });
              }
            });
          } else {
            if (item.title.toLowerCase().includes(query)) {
              results.push({
                title: `${menu.title} > ${item.title}`,
                url: item.url,
              });
            }
          }
        });
      }
    });

    return results.slice(0, 10);
  }

  toggleSearchModal() {
    this.isSearchModalOpen.update((v) => !v);
    if (this.isSearchModalOpen()) {
      this.searchQuery.set('');
    }
  }

  hasPurchasedPackage(): boolean {
    return sessionStorage.getItem('has_active_package') === 'true';
  }

  private setPackageStatusFromResponse(res: any): void {
    const hasActivePackage = Boolean(
      res?.user?.has_active_package ||
      res?.payment?.has_active_package ||
      res?.has_active_package
    );

    sessionStorage.setItem('has_active_package', String(hasActivePackage));
  }

  private syncPackageStatus(): void {
    const userId = Number(sessionStorage.getItem('user_id'));
    if (!sessionStorage.getItem('access_token') || !userId) return;

    this.service.getSchoolPaymentHistory(userId).subscribe({
      next: (payments: any) => {
        const hasActivePackage = Array.isArray(payments)
          && payments.some((payment: any) => payment?.payment_status === 'SUCCESS');
        sessionStorage.setItem('has_active_package', String(hasActivePackage));
      },
      error: () => {
        sessionStorage.removeItem('has_active_package');
      }
    });
  }
  scroll() {
    const currentPath = this.router.url.split('?')[0].split('#')[0];

    if (currentPath === '/') {
      this.scrollToPricing.emit();
      this.scrollToPricingElement();
      return;
    }

    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => this.scrollToPricingElement(), 300);
    });
  }

  private scrollToPricingElement(): void {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  closeSearchModal() {
    this.isSearchModalOpen.set(false);
  }

  //onSearchItemClick(url: string) {
  // if (url.startsWith('http')) {
  // window.open(url, '_blank');
  //} else {
  // this.router.navigateByUrl(url);
  //}
  //this.closeSearchModal();
  //}

  onSearchItemClick(url: string): void {

    this.closeSearchModal();

    const token = sessionStorage.getItem('access_token');

    if (!token) {
      this.openModal('signup');
      return;
    }

    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(url);
    }
  }

  navigationMenu: any[] = [
    {
      title: 'Home',
      url: '/',
      type: 'link'
    },


    {
      title: 'Curriculum',
      type: 'dropdown',
      items: [
        {
          title: 'Board Curriculum',
          type: 'nested-dropdown',
          items: [
            { title: 'CBSE', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse' },
            { title: 'ICSE', url: '/iframe-view?url=https://zenai.theteachly.com/board/icse' },
            { title: 'ISC', url: '/iframe-view?url=https://zenai.theteachly.com/board/isc' },

            { title: 'UP Board', url: 'https://student.theteachly.com/auth/login' }
          ]
        },
        { title: 'CT/AI', url: '/ctai' },

        // { title: 'Computer Course', url: 'https://zenai.theteachly.com/school-courses/computer-course-school' },
        { title: 'Essential Studies', url: '/iframe-view?url=https://zenai.theteachly.com/school-courses/aptitude60' },
        { title: 'Project Work', url: '/iframe-view?url=https://zenai.theteachly.com/project-work/school-level' },
        { title: 'Stem Simulators', url: '/simulator' }
      ]
    },
    {
      title: 'Simulations',
      type: 'dropdown',
      items: [
        { title: 'AI visualization LAB', url: '/curriculum-details?id=13&title=AI%20Learning%20Module' },
        { title: 'Robotics Simulator', url: '/curriculum-details?id=10&title=Robotics%20Virtual%20Lab%20Module' },
        { title: 'Drone Simulator', url: '/curriculum-details?id=12&title=Drone%20Virtual%20Lab%20Module' },

      ]
    },

    {
      title: 'Languages',
      type: 'dropdown',
      items: [
        { title: 'ARABIC', url: '/iframe-view?url=https://zenai.theteachly.com/course/arabic-language' },
        { title: 'GERMAN', url: '/iframe-view?url=https://zenai.theteachly.com/course/german-language' },
        { title: 'SPANISH', url: '/iframe-view?url=https://zenai.theteachly.com/course/spanish-language' },
        { title: 'FRENCH', url: '/iframe-view?url=https://zenai.theteachly.com/course/french-language' },
        { title: 'SANSKRIT', url: '/iframe-view?url=https://zenai.theteachly.com/course/sanskrit' }
      ]
    },
    {
      title: "Cognitive Skills",
      url: '/cognitive-skill-profile',
      type: 'link',
      // icon: 'fas fa-child'
    },
    {
      title: "Child Psychology",
      url: '/child-psychology',
      type: 'link',
      // icon: 'fas fa-child'
    },
    {
      title: 'Competitive Exams',
      type: 'dropdown',
      items: [
        { title: 'IELTS', url: '/iframe-view?url=https://zenai.theteachly.com/course/international-english-language-testing-system-ielts' },

        { title: 'Engineering', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/engineering' },
        { title: 'Medical', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/medical' },
        { title: 'Bank Exams', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/competitive-bank-exams' },
        { title: 'Foundation', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/foundation' },
        { title: 'SSC', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/staff-selection-commission-ssc' },
        { title: 'Defence', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/defence' },
        { title: 'UPSSSC', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/upsssc' },
        { title: 'Railways', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/railways' },
        { title: 'State Level Exams', url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/state-level-exams' }
      ]
    },



    // {
    //   title: 'About Us',
    //   url: '/about-us',
    //   type: 'link'
    // },
  ];

  openMessage(message: string) {
    this.message = message;
    this.showMessageModal = true;
  }

  closeMessage() {
    this.showMessageModal = false;
  }

  courseSections: any[] = [
    {
      sectionTitle: 'Board Curriculum',
      sectionKey: 'Class',
      items: [
        {
          name: 'CBSE',
          subItems: [
            { name: '6', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-6' },
            { name: '7', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-7' },
            { name: '8', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-8' },
            { name: '9', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-9' },
            { name: '10', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-10' },
            { name: '11', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-11' },
            { name: '12', url: '/iframe-view?url=https://zenai.theteachly.com/board/cbse?curriculum=Class-12' },
          ],
        },
        {
          name: 'ISC',
          subItems: [
            { name: '11', url: '/iframe-view?url=https://zenai.theteachly.com/board/isc?curriculum=Class-11' },
            { name: '12', url: '/iframe-view?url=https://zenai.theteachly.com/board/isc?curriculum=Class-12' },
          ],
        },
        {
          name: 'ICSE',
          subItems: [
            { name: '6', url: '/iframe-view?url=https://zenai.theteachly.com/board/icse?curriculum=Class-6' },
            { name: '7', url: '/iframe-view?url=https://zenai.theteachly.com/board/icse?curriculum=Class-7' },
            { name: '8', url: '/iframe-view?url=https://zenai.theteachly.com/board/icse?curriculum=Class-8' },
            { name: '9', url: '/iframe-view?url=https://zenai.theteachly.com/board/icse?curriculum=Class-9' },
            { name: '10', url: '/iframe-view?url=https://zenai.theteachly.com/board/icse?curriculum=Class-10' },
          ],
        },
        {
          name: 'UP Board',
          subItems: [
            { name: '5', url: 'https://student.theteachly.com/auth/login' },
            { name: '6', url: 'https://student.theteachly.com/auth/login' },
            { name: '7', url: 'https://student.theteachly.com/auth/login' },
            { name: '8', url: 'https://student.theteachly.com/auth/login' },
            { name: '9', url: 'https://student.theteachly.com/auth/login' },
            { name: '10', url: 'https://student.theteachly.com/auth/login' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'Competitive Preparation',
      sectionKey: 'competitive',
      items: [
        {
          name: 'Engineering',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/engineering',
        },
        {
          name: 'Medical',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/medical',
        },
        {
          name: 'Bank Exams',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/competitive-bank-exams',
        },
        {
          name: 'Foundation',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/foundation',
        },
        {
          name: 'SSC',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/staff-selection-commission-ssc',
        },
        {
          name: 'Defence',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/defence',
        },
        {
          name: 'UPSSSC',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/upsssc',
        },
        {
          name: 'Railways',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/railways',
        },
        {
          name: 'State Level Exams',
          url: '/iframe-view?url=https://zenai.theteachly.com/competitive-curriculum/state-level-exams',
        },
      ],
    },
    {
      sectionTitle: 'Foreign Languages',
      sectionKey: 'Languages',
      items: [
        {
          name: 'IELTS',
          url: '/iframe-view?url=https://zenai.theteachly.com/course/international-english-language-testing-system-ielts',
        },
        {
          name: 'ARABIC',
          url: 'https://zenai.theteachly.com/course/arabic-language',
        },
        {
          name: 'GERMAN',
          url: 'https://zenai.theteachly.com/course/german-language',
        },
        {
          name: 'SPANISH',
          url: 'https://zenai.theteachly.com/course/spanish-language',
        },
        {
          name: 'FRENCH',
          url: 'https://zenai.theteachly.com/course/french-language',
        },
        {
          name: 'SANSKRIT',
          url: 'https://zenai.theteachly.com/course/sanskrit',
        },
      ],
    },
    {
      sectionTitle: 'Career Counseling',
      sectionKey: 'Career',
      items: [
        {
          name: 'Career in Civil Service',
          url: 'https://zenai.theteachly.com/course/career-in-civil-service',
        },
        {
          name: 'Career in Mass Communication',
          url: 'https://zenai.theteachly.com/course/career-in-mass-communication',
        },
        {
          name: 'Career in Physics',
          url: 'https://zenai.theteachly.com/course/career-in-physics',
        },
        {
          name: 'Popular Careers',
          url: 'https://zenai.theteachly.com/course/popular-careers',
        },
        {
          name: 'Study Abroad',
          url: 'https://zenai.theteachly.com/course/study-abroad',
        },
        {
          name: 'Skill Based Career Choices',
          url: 'https://zenai.theteachly.com/course/skill-based-career-choices',
        },
        {
          name: 'Career in Mathematics',
          url: 'https://zenai.theteachly.com/course/career-in-mathematics',
        },
        {
          name: 'Career in Chemistry',
          url: 'https://zenai.theteachly.com/course/career-in-chemistry',
        },
        {
          name: 'Career in Commerce',
          url: 'https://zenai.theteachly.com/course/career-in-commerce',
        },
        {
          name: 'Careers in Biology',
          url: 'https://zenai.theteachly.com/course/careers-in-biology',
        },
      ],
    },
    {
      sectionTitle: 'School Curriculum',
      sectionKey: 'school',
      items: [
        {
          name: 'Skilling Courses',
          url: 'https://zenai.theteachly.com/school-courses/skilling-courses-school',
        },
        {
          name: 'Computer Course',
          url: 'https://zenai.theteachly.com/school-courses/computer-course-school',
        },
        {
          name: 'Foundation Courses',
          url: 'https://zenai.theteachly.com/school-courses/aptitude60',
        },

        {
          name: 'Project Work',
          url: 'https://zenai.theteachly.com/project-work/school-level',
        },

      ],
    },
    {
      sectionTitle: 'Entrepreneurship Courses',
      sectionKey: 'entrepreneurship',
      items: [
        {
          name: 'Industrial Documentaries',
          url: 'https://zenai.theteachly.com/industrial-documentry',
        },
        {
          name: 'Project Reports',
          url: 'https://zenai.theteachly.com/project-reports',
        },
        {
          name: 'Business Idea',
          url: 'https://zenai.theteachly.com/business-idea',
        },
        {
          name: 'Professional Episodes',
          url: 'https://zenai.theteachly.com/career-courses/technical-courses',
        },
        {
          name: 'Hobby Courses',
          url: 'https://zenai.theteachly.com/career-courses/hobby-courses',
        },

      ],
    },
    {
      sectionTitle: 'Skill & Hobby Courses',
      sectionKey: 'skills',
      items: [
        {
          name: 'Painting',
          url: 'https://zenai.theteachly.com/career-courses/painting',
        },
        {
          name: 'Music',
          url: 'https://zenai.theteachly.com/career-courses/music',
        },
        {
          name: 'Technical Courses',
          url: 'https://zenai.theteachly.com/career-courses/technical-courses',
        },
        {
          name: 'Industrial Courses',
          url: 'https://zenai.theteachly.com/industrial-courses',
        },
        {
          name: 'Hobby Courses',
          url: 'https://zenai.theteachly.com/career-courses/hobby-courses',
        },
        {
          name: 'Project Report',
          url: 'https://zenai.theteachly.com/project-work/college-level',
        },
      ],
    },
    {
      sectionTitle: 'STEM Simulator',
      sectionKey: 'simulator',
      items: [
        { name: 'Physics Simulator', url: '/simulator' },
        { name: 'Chemistry Simulator', url: '/simulator' },
        { name: 'Math Simulator', url: '/simulator' },
        { name: 'Biology Simulator', url: '/simulator' },
      ],
    },
  ];

  tickerItems: string[] = [];

  isMenuLinkActive(url: string): boolean {
    if (!url || url.startsWith('http')) return false;
    return this.router.isActive(url, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  isDropdownActive(menu: any): boolean {
    if (menu.type !== 'dropdown' || !menu.items) return false;

    return menu.items.some((item: any) => {
      if (item.type === 'nested-dropdown' && item.items) {
        return item.items.some((subItem: any) =>
          this.isMenuLinkActive(subItem.url),
        );
      }
      return this.isMenuLinkActive(item.url);
    });
  }

  getRoutePath(url: string): string {
    if (!url || url.startsWith('http')) return url;
    return url.split('?')[0];
  }

  getRouteQueryParams(url: string): any {
    if (!url || !url.includes('?') || url.startsWith('http')) return {};
    const query = url.split('?')[1];
    const params: any = {};
    query.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value);
    });
    return params;
  }

  constructor(
    private translateService: TranslateService,
    private ngZone: NgZone,
    private router: Router,
    private fb: FormBuilder,
    private popupService: PopupService,
    private renderer: Renderer2,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {

    this.popupService.popupData$.subscribe((plan) => {

      if (plan) {
        this.paymentSummary.planKey = plan.planKey;
        this.paymentSummary.planName = plan.planName;
        this.paymentSummary.taxableAmount = plan.taxableAmount;
        this.paymentSummary.gstAmount = plan.gstAmount;
        this.paymentSummary.totalAmount = plan.totalAmount;
        this.paymentSummary.planMonths = plan.planMonths || 1;
        this.paymentSummary.couponCode = plan.couponCode || null;
      }
    });
    this.translateService.setDefaultLang('en');
    this.selectedLanguage = '';
    this.translateService.use('en');

    this.createForms();
    this.syncPackageStatus();
    this.updateActiveClass();
    // this.getBoardsAndClasses();

    this.loadGoogleTranslate();
    this.flattenTickerItems();

    this.classList = [
      { id: 3, name: 'Class 3' },
      { id: 4, name: 'Class 4' },
      { id: 5, name: 'Class 5' },
      { id: 6, name: 'Class 6' },
      { id: 7, name: 'Class 7' },
      { id: 8, name: 'Class 8' },
      { id: 9, name: 'Class 9' },
      { id: 10, name: 'Class 10' },
      { id: 11, name: 'Class 11' },
      { id: 12, name: 'Class 12' },
    ];

    this.boardList = [
      { id: 1, name: 'CBSE' },
      { id: 2, name: 'ICSE' },
      { id: 3, name: 'ISC' },
      { id: 4, name: 'UP Board' },
    ];
  }
  /* =========================
   🎯 GET BOARD + CLASS DATA
========================= */


  /* =========================
     🔄 BOARD CHANGE
  ========================= */
  /* =========================
     🔄 BOARD CHANGE
  ========================= */
  setClasses(boardId: number) {

    this.signupForm.patchValue({ class: '' });

    switch (Number(boardId)) {

      case 1:
        this.classList = [
          { id: 1, name: '1st' },
          { id: 2, name: '2nd' },
          { id: 3, name: '3rd' },
          { id: 4, name: '4th' },
          { id: 5, name: '5th' },
          { id: 6, name: '6th' },
          { id: 7, name: '7th' },
          { id: 8, name: '8th' },
          { id: 9, name: '9th' },
          { id: 10, name: '10th' },
          { id: 11, name: '11th' },
          { id: 12, name: '12th' }
        ];
        break;

      case 2:
        this.classList = [
          { id: 1, name: '1st' },
          { id: 2, name: '2nd' },
          { id: 3, name: '3rd' },
          { id: 4, name: '4th' },
          { id: 5, name: '5th' },
          { id: 6, name: '6th' },
          { id: 7, name: '7th' },
          { id: 8, name: '8th' },
          { id: 9, name: '9th' },
          { id: 10, name: '10th' }
        ];
        break;

      default:
        this.classList = [
          { id: 3, name: '3rd' },
          { id: 4, name: '4th' },
          { id: 5, name: '5th' },
          { id: 6, name: '6th' },
          { id: 7, name: '7th' },
          { id: 8, name: '8th' },
          { id: 9, name: '9th' },
          { id: 10, name: '10th' },
          { id: 11, name: '11th' },
          { id: 12, name: '12th' }
        ];
    }
  }

  /* =========================
      CLASS NAME FORMAT
  ========================= */
  formatClassName(name: string): string {
    const num = name.match(/\d+/)?.[0];

    if (!num) return name;

    const suffix =
      num === '1' ? 'st' : num === '2' ? 'nd' : num === '3' ? 'rd' : 'th';

    return `${num}${suffix}`;
  }
  createForms() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],

      mobile: [
        '',
        [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)],
      ],

      Email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmpassword: ['', Validators.required],

      board: ['', Validators.required],

      class: ['', Validators.required],

    });

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: passwordsMatchValidator }
    );

    this.restoreSignupDraft();
    this.signupForm.valueChanges.subscribe((formValue) => {
      if (this.isRestoringSignupDraft) return;

      const draft = {
        name: formValue.name || '',
        mobile: formValue.mobile || '',
        Email: formValue.Email || '',
        board: formValue.board || '',
        class: formValue.class || '',
      };

      const hasDraftValue = Object.values(draft).some((value) => String(value).trim() !== '');
      if (hasDraftValue) {
        localStorage.setItem(this.signupDraftStorageKey, JSON.stringify(draft));
      } else {
        localStorage.removeItem(this.signupDraftStorageKey);
      }
    });

  }

  private restoreSignupDraft(): void {
    const savedDraft = localStorage.getItem(this.signupDraftStorageKey);
    if (!savedDraft || !this.signupForm) return;

    try {
      const draft = JSON.parse(savedDraft);
      this.isRestoringSignupDraft = true;
      this.signupForm.patchValue({
        name: draft.name || '',
        mobile: draft.mobile || '',
        Email: draft.Email || '',
        board: draft.board || '',
        class: draft.class || '',
        password: '',
        confirmpassword: '',
      }, { emitEvent: false });

      if (draft.board) {
        this.setClasses(Number(draft.board));
        this.signupForm.patchValue({ class: draft.class || '' }, { emitEvent: false });
      }
    } catch {
      localStorage.removeItem(this.signupDraftStorageKey);
    } finally {
      this.isRestoringSignupDraft = false;
    }
  }

  private resetSignupFormWithDraft(tab: 'login' | 'signup'): void {
    this.isRestoringSignupDraft = true;
    this.signupForm.reset();
    this.isRestoringSignupDraft = false;

    if (tab === 'signup') {
      this.restoreSignupDraft();
    }
  }
  flattenTickerItems(): void {
    const items: string[] = [];
    this.courseSections.forEach((section) => {
      items.push(section.sectionTitle);
    });
    this.tickerItems = items;
  }

  loadGoogleTranslate(): void {
    this.ngZone.runOutsideAngular(() => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages:
              'en,hi,bn,te,mr,ta,gu,ur,kn,ml,or,pa,as,ne,sa,sd,kok,doi,mai,mni,ks,sat',
          },
          'google_translate_element',
        );
      };
    });
  }
  openModal(tab: 'login' | 'signup', isSchool: boolean = false) {

    if (tab === 'signup' && this.isLoggedIn && this.paymentSummary.planName) {
      if (this.hasPurchasedPackage()) {
        this.openMessage("You already have an active package.");
        return;
      }

        this.paymentSummary.userid= Number(sessionStorage.getItem('user_id')),
      this.paymentSummary.schoolId= sessionStorage.getItem('student_id'),
      this.paymentSummary.schoolName= sessionStorage.getItem('school_name'),
      this.showPaymentPopup = true;
      return;
    }

    this.activeTab = tab;
    this.isSchoolSignup = isSchool;
    this.isSignupOpen = true;
    this.resetSignupFormWithDraft(tab);
    if (this.isSchoolSignup) {
      this.signupForm.get('board')?.clearValidators();
      this.signupForm.get('class')?.clearValidators();
    } else {
      this.signupForm.get('board')?.setValidators(Validators.required);
      this.signupForm.get('class')?.setValidators(Validators.required);
    }

    this.signupForm.get('board')?.updateValueAndValidity();
    this.signupForm.get('class')?.updateValueAndValidity();

    setTimeout(() => {
      this.updateActiveClass();
    });
  }

  updateActiveClass() {
    const loginBtn = document.querySelector('.pill-btn.login');
    const signupBtn = document.querySelector('.pill-btn.signup');

    if (this.activeTab === 'login') {
      loginBtn?.classList.add('active');
      signupBtn?.classList.remove('active');
    } else {
      signupBtn?.classList.add('active');
      loginBtn?.classList.remove('active');
    }
  }
  closeSignupModal() {
    this.isSignupOpen = false;
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleSignupPasswordVisibility(): void {
    this.showSignupPassword = !this.showSignupPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onNameInput(event: Event, form: FormGroup): void {
    const input = event.target as HTMLInputElement;
    const lettersOnly = input.value.replace(/[^a-zA-Z\s]/g, '');

    if (input.value !== lettersOnly) {
      input.value = lettersOnly;
    }

    form.get('name')?.setValue(lettersOnly, { emitEvent: false });
  }

  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);

    if (input.value !== digitsOnly) {
      input.value = digitsOnly;
    }

    this.signupForm.get('mobile')?.setValue(digitsOnly, { emitEvent: false });
  }

  openProfileModal(): void {
    this.closeUserMenu();
    this.profileForm.reset({ name: this.userName });
    this.profileData = null;
    this.isProfileOpen = true;
    this.isProfileLoading = true;

    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profileData = res;
        this.profileForm.patchValue({
          name: res?.name || res?.first_name || this.userName,
        });
        this.isProfileLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.isProfileLoading = false;
      },
    });
  }

  closeProfileModal(): void {
    this.isProfileOpen = false;
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    sessionStorage.setItem('school_name', this.profileForm.value.name);
    this.closeProfileModal();
    this.openMessage('Profile updated successfully.');
  }

  openChangePasswordModal(): void {
    this.closeUserMenu();
    this.changePasswordForm.reset();
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmNewPassword = false;
    this.isChangePasswordOpen = true;
  }

  closeChangePasswordModal(): void {
    this.isChangePasswordOpen = false;
  }

  submitChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.closeChangePasswordModal();
    this.openMessage('Password changed successfully.');
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmNewPasswordVisibility(): void {
    this.showConfirmNewPassword = !this.showConfirmNewPassword;
  }
  switchTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
  }

  // 🔐 LOGIN FUNCTION
  onLogin() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.service.chaneStuLogin(data).subscribe({

      next: (res: any) => {

        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem('user_id', res.user.user_id.toString());
        sessionStorage.setItem('student_id', res.user.student_id);
        sessionStorage.setItem('school_name', res.user.first_name);
        sessionStorage.setItem('user_type', res.user.user_type || '');
        this.setPackageStatusFromResponse(res);

        this.headermsg = "Login Successfully";
        this.closeSignupModal();

        if (this.hasPurchasedPackage()) {
          this.showPaymentPopup = false;
          this.openMessage("You already have an active package.");
        } else if (this.paymentSummary?.planName) {
          this.paymentSummary = {
            ...this.paymentSummary,
            schoolId: res.user.student_id,
            schoolName: res.user.first_name,
            userid: res.user.user_id,
          };
          this.showPaymentPopup = true;
        } else {
          this.openMessage("Please select a plan to continue.");
        }
      },

      error: (err: any) => {
        console.log(err);
        this.openMessage(err.error?.detail || "Login failed. Please try again.");
      }

    });


  }

  //  SIGNUP FUNCTION
  onSignup() {
    if (this.signupForm.valid) {
      // console.log('Signup Data:', this.signupForm.value);

      //  yaha API call kar sakte ho
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  submitForm() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.toastService.show('Please fill all required fields correctly.', 'error');
      return;
    }

    const form = this.signupForm.value;
    const selectedBoard = this.boardList.find((board) => String(board.id) === String(form.board));
    const selectedClass = this.classList.find((classItem) => String(classItem.id) === String(form.class));
    const classNumber = selectedClass?.id ?? form.class;

    const data = {
      first_name: form.name,
      last_name: '',

      class_name: this.isSchoolSignup ? null : `Class ${classNumber}`,
      board: this.isSchoolSignup ? null : selectedBoard?.name,

      mobile_no: form.mobile,

      institution_name: form.name,

      class_code: this.isSchoolSignup ? null : form.class,

      email: form.Email,
      password: form.password,

      user_type: this.isSchoolSignup ? 'SCH' : 'STUDENT',
    };

    this.service.chaneStuRegister(data).subscribe({
      next: (res: any) => {
        // console.log(res);
        const registeredUser = res.user || res;

        if (res.access_token) {
          sessionStorage.setItem('access_token', res.access_token);
        }

        // Session Storage
        sessionStorage.setItem('user_id', String(registeredUser.user_id || registeredUser.id));
        sessionStorage.setItem('student_id', registeredUser.student_id);
        sessionStorage.setItem('user_type', registeredUser.user_type || data.user_type);
        sessionStorage.setItem('school_name', registeredUser.first_name);
        this.setPackageStatusFromResponse(res);

        // Payment Summary
        this.paymentSummary = {
          ...this.paymentSummary,
          schoolId: registeredUser.student_id,
          schoolName: registeredUser.first_name,
        };

        // console.log('Payment Summary Before Popup', this.paymentSummary);
        // Open Payment Popup
        this.showPaymentPopup = true;
        this.headermsg = "Register Successfully";
        this.toastService.show('Register Successfully', 'success');
        localStorage.removeItem(this.signupDraftStorageKey);

        this.signupForm.reset();

        this.isSchoolSignup = false;

        this.signupForm.patchValue({
          board: '',
          class: '',
        });

        // Signup popup close
        this.closeSignupModal();
      },
      error: (err) => {
        console.log(err);
        const message = this.getApiErrorMessage(err);
        this.toastService.show(message, 'error');
        this.openMessage(message);
      },
    });
  }

  private getApiErrorMessage(err: any): string {
    const error = err?.error;

    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (typeof error?.detail === 'string') {
      return error.detail;
    }

    if (Array.isArray(error?.detail) && error.detail.length) {
      return error.detail
        .map((item: any) => item?.msg || item?.message)
        .filter(Boolean)
        .join(', ');
    }

    if (Array.isArray(error?.errors) && error.errors.length) {
      return error.errors
        .map((item: any) => item?.message)
        .filter(Boolean)
        .join(', ');
    }

    return 'Registration failed. Please try again.';
  }

  proceedPayment() {
    if (this.isPaymentProcessing) return;

    if (this.hasPurchasedPackage()) {
      this.showPaymentPopup = false;
      this.openMessage("You already have an active package.");
      return;
    }

    if (
      !this.paymentSummary.planKey ||
      !this.paymentSummary.planMonths
    ) {
      this.openMessage("Please select a plan to continue.");
      return;
    }

    this.isPaymentProcessing = true;

    const data = {
      plan_key: this.paymentSummary.planKey,
      plan_duration: Number(this.paymentSummary.planMonths),
      coupon_code: this.paymentSummary.couponCode || null,
    };

    this.service.createSchoolOrder(data).subscribe({
      next: (res: any) => {
        this.openRazorpay(res);
      },
      error: (err) => {
        console.error(err);
        this.isPaymentProcessing = false;
        this.openMessage("Unable to create payment order.");
      },
    });
  }
  openRazorpay(order: any) {
    const options: any = {
      key: order.key,
      currency: order.currency,
      name: 'Teachly',
      description: this.paymentSummary.planName,
      order_id: order.order_id,
      handler: (response: any) => {
        this.verifyPayment(response);
      },
      modal: {
        ondismiss: () => {
          this.isPaymentProcessing = false;
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  verifyPayment(payment: any) {
    const data = {
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,
    };

    this.service.verifySchoolPayment(data).subscribe({
      next: (res: any) => {
        this.setPackageStatusFromResponse(res);
        this.isPaymentProcessing = false;
        this.openMessage(res.message || "Payment Successful");
        if (res.coupon_code) {
          this.openMessage('Coupon Code:' + res.coupon_code);
        }
        this.showPaymentPopup = false;
      },

      error: (err) => {
        console.log(err);
        this.isPaymentProcessing = false;
        this.openMessage("Payment Verification Failed.");
      },
    });
  }

  onLanguageChange(): void {
    const displayLang = this.selectedLanguage;
    const lang = LANGUAGE_MAP[displayLang] || 'en';
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', displayLang);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    this.expandedSections.set(null);
    this.expandedItems.set(null);
  }

  toggleSection(sectionTitle: string): void {
    if (this.expandedSections() === sectionTitle) {
      this.expandedSections.set(null);
    } else {
      this.expandedSections.set(sectionTitle);
    }
    this.expandedItems.set(null);
  }

  toggleItem(itemName: string): void {
    if (this.expandedItems() === itemName) {
      this.expandedItems.set(null);
    } else {
      this.expandedItems.set(itemName);
    }
  }

  setActiveDropdown(title: string | null): void {
    this.activeDropdown.set(title);
    if (title === null) {
      this.activeSubDropdown.set(null);
    }
  }

  setActiveSubDropdown(title: string | null): void {
    this.activeSubDropdown.set(title);
  }

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  get userName(): string {
    return sessionStorage.getItem('school_name') || 'User';
  }

  get userType(): string {
    return sessionStorage.getItem('user_type') === 'SCH' ? 'School' : 'Student';
  }

  get userStudentId(): string {
    return sessionStorage.getItem('student_id') || '-';
  }

  getUserInitials(): string {
    const name = this.userName;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      setTimeout(() => {
        this.renderer.listen('document', 'click', (event: Event) => {
          const target = event.target as HTMLElement;
          if (this.userMenuOpen && !target.closest('.user-menu-container')) {
            this.userMenuOpen = false;
          }
        }, { once: true });
      });
    }
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('student_id');
    sessionStorage.removeItem('school_name');
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('has_active_package');
    this.userMenuOpen = false;
    window.location.reload();
  }

  navigateWithLogin(url: string): void {

    // Home aur login page bina login ke open ho sakte hain
    const publicUrls = ['/', '/about-us'];

    if (publicUrls.includes(this.getRoutePath(url))) {
      this.router.navigateByUrl(url);
      return;
    }

    const token = sessionStorage.getItem('access_token');

    if (!token) {
      this.openModal('signup');
      return;
    }

    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(url);
    }

  }
}
