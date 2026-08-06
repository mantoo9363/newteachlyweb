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
  ChangeDetectorRef
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
import { environment } from '../../../../environments/environment';
import { AuthStorageService } from '../../../core/services/auth-storage.service';

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
  activeTab: 'login' | 'signup' | 'forgot' = 'signup';
  loginErrorMessage = '';
  isLoginLoading = false;
  isSignupLoading = false;
  forgotPasswordForm!: FormGroup;
  forgotPasswordSubmitted = false;
  forgotPasswordLoading = false;
  changePasswordLoading = false;
  changePasswordError = '';
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
  loginError: string = '';
  signupForm!: FormGroup; // Search state
  isSearchModalOpen = signal(false);
  searchQuery = signal('');
  public service = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private readonly signupDraftStorageKey = 'teachly_signup_draft';
  private readonly aiIframeLoginCookie = 'teachly_ai_logged_in';
  private readonly studentPanelSsoUrl = environment.studentPanel.ssoUrl;
  private readonly studentPanelLoginUrl = environment.studentPanel.loginUrl;
  private isRestoringSignupDraft = false;
  get filteredSearchItems() {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    const results: any[] = [];

    // Flatten navigation menu
    this.navigationMenu.forEach((menu) => {
      if (menu.type === 'link') {
        if (menu.title.toLowerCase().includes(query)) {
          results.push({ title: menu.title, url: menu.url, requiresPlan: menu.requiresPlan });
        }
      } else if (menu.items) {
        menu.items.forEach((item: any) => {
          if (item.type === 'nested-dropdown') {
            item.items.forEach((subItem: any) => {
              if (subItem.title.toLowerCase().includes(query)) {
                results.push({
                  title: `${menu.title} > ${item.title} > ${subItem.title}`,
                  url: subItem.url,
                  requiresPlan: subItem.requiresPlan,
                });
              }
            });
          } else {
            if (item.title.toLowerCase().includes(query)) {
              results.push({
                title: `${menu.title} > ${item.title}`,
                url: item.url,
                requiresPlan: item.requiresPlan,
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
    if (!this.authStorage.hasActivePackage()) {
      this.clearPackageStatus();
      this.notifyPackageStatusChanged();
      return false;
    }

    return true;
  }

  private isPurchasedPlan(planKey: string): boolean {
    return this.authStorage.isPlanActive(planKey);
  }

  // The 3 individual plan states: Tech, Smart, and Combo (Tech & Smart together).
  // Combo appears in both groups since it unlocks the whole system.
  private readonly planGroups: Record<'tech' | 'smart', string[]> = {
    tech: ['tech', 'combo'],
    smart: ['smart', 'combo'],
  };

  private readonly planGroupLabels: Record<'tech' | 'smart', string> = {
    tech: 'Tech Education Plan',
    smart: 'Smart Education Plan',
  };

  // Routes that no longer require authGuard (see app.routes.ts) - the pages themselves
  // handle login/plan gating, so nav links to them should stay navigable for guests.
  private readonly publicUrls = ['/', '/about-us', '/cognitive-skill-profile', '/child-psychology', '/curriculum-details', '/reset-password'];

  hasPlanGroupAccess(group: 'tech' | 'smart'): boolean {
    if (!this.hasPurchasedPackage()) return false;
    if (this.authStorage.hasAllAccessPlan()) return true;
    if (group === 'tech' && this.authStorage.hasTechAccessPlan()) return true;
    const activePlanKeys = this.authStorage.getActivePackageKeys();
    return activePlanKeys.some((planKey) => this.planGroups[group].includes(planKey));
  }

  planGroupLabel(group: 'tech' | 'smart'): string {
    return this.planGroupLabels[group];
  }

  isMenuItemAccessible(item: any): boolean {
    if (item?.url && this.publicUrls.includes(this.getRoutePath(item.url))) return true;
    if (!this.isLoggedIn) return false;
    return item?.requiresPlan ? this.hasPlanGroupAccess(item.requiresPlan) : true;
  }

  isNavLinkAccessible(item: any): boolean {
    return this.isMenuItemAccessible(item);
  }

  // Purely a visual "premium content" hint (lock badge / greyed-out styling).
  // Kept separate from isMenuItemAccessible so public-preview pages (e.g. curriculum-details)
  // stay clickable/navigable while still signalling that a plan is required.
  isMenuItemLocked(item: any): boolean {
    return !!item?.requiresPlan && (!this.isLoggedIn || !this.hasPlanGroupAccess(item.requiresPlan));
  }

  private zenAiUrl(path = ''): string {
    return `${environment.urls.zenAi}${path}`;
  }

  private iframeUrl(url: string): string {
    return `/iframe-view?url=${url}`;
  }

  private iframeZenAiUrl(path = ''): string {
    return this.iframeUrl(this.zenAiUrl(path));
  }

  private studentPanelUrl(path = ''): string {
    return `${environment.urls.studentPanel}${path}`;
  }

  private configuredUrl(url: string): string {
    return url
      .replace('https://zenai.theteachly.com', environment.urls.zenAi)
      .replace('https://student.theteachly.com', environment.urls.studentPanel)
      .replace('https://student.theteachly.com', environment.urls.studentPanel);
  }

  private withConfiguredUrls<T>(value: T): T {
    if (Array.isArray(value)) {
      return value.map((item) => this.withConfiguredUrls(item)) as T;
    }

    if (value && typeof value === 'object') {
      return Object.entries(value).reduce((result, [key, entry]) => ({
        ...result,
        [key]: key === 'url' && typeof entry === 'string'
          ? this.configuredUrl(entry)
          : this.withConfiguredUrls(entry),
      }), {} as T);
    }

    return value;
  }

  /**
   * Returns the user's board (normalized to lowercase) from sessionStorage.
   * e.g. 'cbse', 'icse', 'isc', 'up board'
   */
  getUserBoard(): string {
    return (sessionStorage.getItem('user_board') || '').toLowerCase().trim();
  }

  /**
   * Maps a boardKey (from the nav item) to the board names that could come from the API.
   */
  private readonly boardKeyAliases: Record<string, string[]> = {
    cbse: ['cbse'],
    icse: ['icse'],
    isc: ['isc'],
    upboard: ['up board', 'upboard', 'up_board'],
  };

  /**
   * For Board Curriculum sub-items that carry a `boardKey`:
   * - If not logged in → locked
   * - If logged in but plan not active → still locked (plan required)
   * - If logged in and plan active but board doesn't match → locked
   * - If logged in, plan active, and board matches → UNLOCKED
   * Board curriculum stays board-specific even for broad school packages.
   */
  isBoardSubItemLocked(item: any): boolean {
    if (!item?.boardKey) {
      // Not a board-specific item — fall back to normal lock logic
      return this.isMenuItemLocked(item);
    }
    if (!this.isLoggedIn) return true;
    if (item.requiresPlan && !this.hasPlanGroupAccess(item.requiresPlan)) return true;
    const userBoard = this.getUserBoard();
    if (!userBoard) return true; // Board unknown — fail closed, don't unlock every board
    const aliases = this.boardKeyAliases[item.boardKey] || [item.boardKey];
    return !aliases.some((alias) => userBoard.includes(alias));
  }

  /**
   * Checks if the board sub-item is accessible (navigable) for the current user.
   */
  isBoardSubItemAccessible(item: any): boolean {
    return !this.isBoardSubItemLocked(item);
  }

  private isPackageExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;

    const expiryTime = Date.parse(expiresAt);
    return Number.isFinite(expiryTime) && expiryTime <= Date.now();
  }

  private clearPackageStatus(): void {
    this.authStorage.setItem('has_active_package', 'false');
    this.authStorage.removeItem('active_package_key');
    this.authStorage.removeItem('active_package_keys');
    this.authStorage.removeItem('active_plan_expiries');
    this.authStorage.removeItem('package_expires_at');
    this.authStorage.removeItem('active_course');
  }

  private getPlanKeyFromName(planName: string | null | undefined): string | null {
    const normalizedName = planName?.trim().toLowerCase();
    const planMap: Record<string, string> = {
      'school plan': 'school',
      'school': 'school',
      'school tech plan': 'schooltech',
      'school tech': 'schooltech',
      'tech education plan': 'tech',
      'tech plan': 'tech',
      'tech': 'tech',
      'smart education plan': 'smart',
      'smart plan': 'smart',
      'smart': 'smart',
      'tech & smart education plan': 'combo',
      'tech & smart': 'combo',
      'tech and smart': 'combo',
      'combo': 'combo',
    };

    return normalizedName ? planMap[normalizedName] || null : null;
  }

  private notifyPackageStatusChanged(profile?: any): void {
    window.dispatchEvent(new CustomEvent('teachly-package-status-changed', {
      detail: {
        profile,
        hasActivePackage: this.authStorage.getItem('has_active_package') === 'true',
        activePackageKey: this.authStorage.getItem('active_package_key'),
        activePackageKeys: this.authStorage.getActivePackageKeys(),
        packageExpiresAt: this.authStorage.getItem('package_expires_at'),
      },
    }));
  }

  private setPackageStatusFromResponse(res: any): void {
    const activePlans = Array.isArray(res?.active_plans)
      ? res.active_plans.filter((plan: any) =>
          plan?.has_active_package !== false &&
          plan?.is_expired !== true &&
          !this.isPackageExpired(plan?.expires_at)
        )
      : [];
    const activePlanKeysFromPlans = activePlans
      .map((plan: any) => plan?.active_package_key || this.getPlanKeyFromName(plan?.plan_name))
      .filter(Boolean);
    const activePackageKeys = Array.from(new Set([
      ...(Array.isArray(res?.active_package_keys) ? res.active_package_keys : []),
      ...activePlanKeysFromPlans,
      res?.active_package_key,
      res?.payment?.active_package_key,
      res?.user?.active_package_key,
      this.getPlanKeyFromName(res?.course),
      this.getPlanKeyFromName(res?.payment?.plan_name),
    ].filter(Boolean)));
    const planExpiries = activePlans.reduce((expiries: Record<string, string>, plan: any) => {
      const planKey = plan?.active_package_key || this.getPlanKeyFromName(plan?.plan_name);
      if (planKey && plan?.expires_at) {
        expiries[planKey] = plan.expires_at;
      }
      return expiries;
    }, {});
    const packageExpiresAt = res?.package_expires_at || res?.payment?.expires_at;
    const hasActivePackage = activePackageKeys.length > 0 || (
      Boolean(
        res?.user?.has_active_package ||
        res?.payment?.has_active_package ||
        res?.has_active_package
      ) && !this.isPackageExpired(packageExpiresAt)
    );

    this.authStorage.setItem('has_active_package', String(hasActivePackage));

    const activePackageKey = activePackageKeys[0] ||
      res?.active_package_key ||
      res?.payment?.active_package_key ||
      res?.user?.active_package_key ||
      this.getPlanKeyFromName(res?.course) ||
      this.getPlanKeyFromName(res?.payment?.plan_name);

    if (activePackageKey && hasActivePackage) {
      this.authStorage.setItem('active_package_key', activePackageKey);
      this.authStorage.setItem('active_package_keys', JSON.stringify(activePackageKeys));
      this.authStorage.setItem('active_plan_expiries', JSON.stringify(planExpiries));
    } else if (!hasActivePackage) {
      this.authStorage.removeItem('active_package_key');
      this.authStorage.removeItem('active_package_keys');
      this.authStorage.removeItem('active_plan_expiries');
    }

    if (packageExpiresAt && hasActivePackage) {
      this.authStorage.setItem('package_expires_at', packageExpiresAt);
    } else if (!hasActivePackage) {
      this.authStorage.removeItem('package_expires_at');
    }

    const activeCourse = activePlans.map((plan: any) => plan?.plan_name).filter(Boolean).join(', ') || res?.course || res?.payment?.plan_name;
    if (activeCourse && hasActivePackage) {
      this.authStorage.setItem('active_course', activeCourse);
    } else {
      this.authStorage.removeItem('active_course');
    }

    this.notifyPackageStatusChanged(res);
  }

  private syncPackageStatus(logoutOnAuthError = true): void {
    const userId = Number(this.authStorage.getItem('user_id'));
    if (!this.authStorage.getToken() || !userId) return;

    this.service.getSchoolPaymentHistory(userId, logoutOnAuthError).subscribe({
      next: (payments: any) => {
        const activePayments = Array.isArray(payments)
          ? payments.filter((payment: any) => payment?.is_active && !this.isPackageExpired(payment?.expires_at))
          : [];
        const activePayment = activePayments[0] || null;
        const hasActivePackage = activePayments.length > 0;

        this.authStorage.setItem('has_active_package', String(hasActivePackage));

        const activePackageKeys = Array.from(new Set(
          activePayments
            .map((payment: any) =>
              payment?.active_package_key ||
              this.getPlanKeyFromName(payment?.plan_name) ||
              this.getPlanKeyFromName(payment?.course)
            )
            .filter(Boolean)
        ));
        const activePackageKey = activePackageKeys[0];
        const planExpiries = activePayments.reduce((expiries: Record<string, string>, payment: any) => {
          const planKey =
            payment?.active_package_key ||
            this.getPlanKeyFromName(payment?.plan_name) ||
            this.getPlanKeyFromName(payment?.course);
          if (planKey && payment?.expires_at) {
            expiries[planKey] = payment.expires_at;
          }
          return expiries;
        }, {});

        if (activePackageKey && hasActivePackage) {
          this.authStorage.setItem('active_package_key', activePackageKey);
          this.authStorage.setItem('active_package_keys', JSON.stringify(activePackageKeys));
          this.authStorage.setItem('active_plan_expiries', JSON.stringify(planExpiries));
        } else {
          this.authStorage.removeItem('active_package_key');
          this.authStorage.removeItem('active_package_keys');
          this.authStorage.removeItem('active_plan_expiries');
        }

        if (activePayment?.expires_at && hasActivePackage) {
          this.authStorage.setItem('package_expires_at', activePayment.expires_at);
        } else {
          this.authStorage.removeItem('package_expires_at');
        }

        const activeCourse = activePayments
          .map((payment: any) => payment?.course || payment?.plan_name)
          .filter(Boolean)
          .join(', ');

        if (hasActivePackage && activeCourse) {
          this.authStorage.setItem('active_course', activeCourse);
        } else {
          this.authStorage.removeItem('active_course');
        }

        this.notifyPackageStatusChanged(activePayment);
      },
      error: (err) => {
        console.error('Failed to sync package status', err);
        this.notifyPackageStatusChanged();
      }
    });
  }

  private loadLoggedInProfile(): void {
    if (!this.authStorage.getToken()) return;
    if (this.authStorage.wasStudentPanelSsoRecent()) {
      this.notifyPackageStatusChanged();
      return;
    }

    console.log('Calling profile API on home load');
    this.service.getProfile(false).subscribe({
      next: (profile: any) => {
        this.profileData = profile;

        if (profile?.user_id) {
          this.authStorage.setItem('user_id', String(profile.user_id));
        }

        if (profile?.student_id) {
          this.authStorage.setItem('student_id', profile.student_id);
        }

        if (profile?.first_name) {
          this.authStorage.setItem('school_name', profile.first_name);
        }

        if (profile?.user_type) {
          this.authStorage.setItem('user_type', profile.user_type);
        }

        if (profile?.board) {
          sessionStorage.setItem('user_board', profile.board);
        }

        this.setPackageStatusFromResponse(profile);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.syncPackageStatus(false);
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

  onSearchItemClick(url: string, requiresPlan?: 'tech' | 'smart'): void {

    this.closeSearchModal();

    if (this.publicUrls.includes(this.getRoutePath(url))) {
      this.router.navigateByUrl(url);
      return;
    }

    const token = this.authStorage.getToken();

    if (!token) {
      this.openModal('signup');
      return;
    }

    if (requiresPlan && !this.hasPlanGroupAccess(requiresPlan)) {
      this.openMessage(`Upgrade to the ${this.planGroupLabel(requiresPlan)} to access this content.`);
      return;
    }

    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(url);
    }
  }

  navigationMenu: any[] = this.withConfiguredUrls([
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
          requiresPlan: 'smart',
          items: [
            { title: 'CBSE', url: this.iframeZenAiUrl('/board/cbse'), requiresPlan: 'smart', boardKey: 'cbse' },
            { title: 'ICSE', url: this.iframeZenAiUrl('/board/icse'), requiresPlan: 'smart', boardKey: 'icse' },
            { title: 'ISC', url: this.iframeZenAiUrl('/board/isc'), requiresPlan: 'smart', boardKey: 'isc' },
            { title: 'UP Board', url: this.iframeUrl(this.studentPanelUrl('/auth/login')), requiresPlan: 'smart', boardKey: 'upboard' }
          ]
        },
        { title: 'CT/AI', url: '/ctai', requiresPlan: 'smart' },

        // { title: 'Computer Course', url: this.zenAiUrl('/school-courses/computer-course-school') },
        { title: 'Essential Studies', url: this.iframeZenAiUrl('/school-courses/aptitude60'), requiresPlan: 'smart' },
        { title: 'Project Work', url: this.iframeZenAiUrl('/project-work/school-level'), requiresPlan: 'smart' },
        { title: 'Stem Simulators', url: '/simulator', requiresPlan: 'smart' }
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
        { title: 'ARABIC', url: this.iframeZenAiUrl('/course/arabic-language'), requiresPlan: 'smart' },
        { title: 'GERMAN', url: this.iframeZenAiUrl('/course/german-language'), requiresPlan: 'smart' },
        { title: 'SPANISH', url: this.iframeZenAiUrl('/course/spanish-language'), requiresPlan: 'smart' },
        { title: 'FRENCH', url: this.iframeZenAiUrl('/course/french-language'), requiresPlan: 'smart' },
        { title: 'SANSKRIT', url: this.iframeZenAiUrl('/course/sanskrit'), requiresPlan: 'smart' }
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
        { title: 'IELTS', url: this.iframeZenAiUrl('/course/international-english-language-testing-system-ielts'), requiresPlan: 'smart' },

        { title: 'Engineering', url: this.iframeZenAiUrl('/competitive-curriculum/engineering'), requiresPlan: 'smart' },
        { title: 'Medical', url: this.iframeZenAiUrl('/competitive-curriculum/medical'), requiresPlan: 'smart' },
        { title: 'Bank Exams', url: this.iframeZenAiUrl('/competitive-curriculum/competitive-bank-exams'), requiresPlan: 'smart' },
        { title: 'Foundation', url: this.iframeZenAiUrl('/competitive-curriculum/foundation'), requiresPlan: 'smart' },
        { title: 'SSC', url: this.iframeZenAiUrl('/competitive-curriculum/staff-selection-commission-ssc'), requiresPlan: 'smart' },
        { title: 'Defence', url: this.iframeZenAiUrl('/competitive-curriculum/defence'), requiresPlan: 'smart' },
        { title: 'UPSSSC', url: this.iframeZenAiUrl('/competitive-curriculum/upsssc'), requiresPlan: 'smart' },
        { title: 'Railways', url: this.iframeZenAiUrl('/competitive-curriculum/railways'), requiresPlan: 'smart' },
        { title: 'State Level Exams', url: this.iframeZenAiUrl('/competitive-curriculum/state-level-exams'), requiresPlan: 'smart' }
      ]
    },



    // {
    //   title: 'About Us',
    //   url: '/about-us',
    //   type: 'link'
    // },
  ]);

  openMessage(message: string) {
    this.message = message;
    this.showMessageModal = true;
  }

  closeMessage() {
    this.showMessageModal = false;
  }

  courseSections: any[] = this.withConfiguredUrls([
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
  ]);

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

  getMenuHref(url: string): string | null {
    if (this.isStudentPanelLoginUrl(url)) {
      return this.studentPanelLoginUrl;
    }

    return url;
  }

  private isStudentPanelLoginUrl(url: string): boolean {
    const studentPanelLoginUrls = [
      this.studentPanelLoginUrl,
      `${environment.urls.studentPanel}/auth/login`,
      `${environment.urls.productionStudentPanel}/auth/login`,
    ];

    return studentPanelLoginUrls.includes(url);
  }

  private buildStudentPanelSsoUrl(accessToken: string): string {
    const dashboardUrl = this.studentPanelLoginUrl.replace(/\/auth\/login$/, '/dashboard');
    const params = new URLSearchParams({
      token: accessToken,
      redirect: dashboardUrl,
    });

    return `${this.studentPanelSsoUrl}?${params.toString()}`;
  }

  private openStudentPanelWithAccessToken(): void {
    const accessToken = this.authStorage.getToken();
    if (!accessToken) {
      this.openModal('login');
      return;
    }

    this.authStorage.markStudentPanelSso();
    window.open(this.buildStudentPanelSsoUrl(accessToken), '_blank');
  }

  constructor(
    private translateService: TranslateService,
    private ngZone: NgZone,
    private router: Router,
    private fb: FormBuilder,
    private popupService: PopupService,
    private renderer: Renderer2,
    private toastService: ToastService,
    private authStorage: AuthStorageService,
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

    this.popupService.signup$.subscribe((shouldOpen: boolean) => {
      if (shouldOpen) {
        this.openModal('signup');
        this.popupService.closeSignup();
      }
    });

    this.translateService.setDefaultLang('en');
    this.selectedLanguage = '';
    this.translateService.use('en');

    this.createForms();
    this.loadLoggedInProfile();
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
    this.loginForm.valueChanges.subscribe(() => {
      this.loginErrorMessage = '';
      const passwordControl = this.loginForm.get('password');
      if (passwordControl?.errors?.['invalidCredentials']) {
        const { invalidCredentials, ...remainingErrors } = passwordControl.errors;
        passwordControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      if (this.isPurchasedPlan(this.paymentSummary.planKey)) {
        this.openMessage("This package is already selected.");
        return;
      }

        this.paymentSummary.userid= Number(this.authStorage.getItem('user_id')),
      this.paymentSummary.schoolId= this.authStorage.getItem('student_id'),
      this.paymentSummary.schoolName= this.authStorage.getItem('school_name'),
      this.showPaymentPopup = true;
      return;
    }

    this.activeTab = tab;
    this.loginErrorMessage = '';
    this.isSchoolSignup = isSchool;
    this.isSignupOpen = true;
    this.loginError = '';
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
    if (this.isLoginLoading) return;
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

    this.authStorage.setItem('school_name', this.profileForm.value.name);
    this.closeProfileModal();
    this.openMessage('Profile updated successfully.');
  }

  openChangePasswordModal(): void {
    this.closeUserMenu();
    this.changePasswordForm.reset();
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmNewPassword = false;
    this.changePasswordError = '';
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

    this.changePasswordError = '';
    this.changePasswordLoading = true;

    const { currentPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;
    const payload = {
      old_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmNewPassword,
    };

    this.service.changePassword(payload).subscribe({
      next: () => {
        this.changePasswordLoading = false;
        this.closeChangePasswordModal();
        this.openMessage('Password changed successfully.');
      },
      error: (err: any) => {
        this.changePasswordLoading = false;
        const errorDetail = err?.error?.detail || err?.error?.message || err?.message;
        this.changePasswordError = typeof errorDetail === 'string' ? errorDetail : 'Failed to change password. Please check your current password and try again.';
      },
    });
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
    this.loginErrorMessage = '';
  }

  openForgotPassword(): void {
    this.forgotPasswordForm.reset();
    this.forgotPasswordSubmitted = false;
    this.activeTab = 'forgot';
  }

  backToLoginFromForgot(): void {
    this.forgotPasswordSubmitted = false;
    this.activeTab = 'login';
  }

  submitForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.forgotPasswordLoading = true;
    const email = this.forgotPasswordForm.value.email;
    
    this.service.forgotPassword(email).subscribe({
      next: (res) => {
        console.log('Forgot password next:', res);
        this.forgotPasswordLoading = false;
        this.forgotPasswordSubmitted = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Forgot password error:', err);
        this.forgotPasswordLoading = false;
        
        // Show the actual error message or a generic error to help debug backend issues
        const errorDetail = err?.error?.detail || err?.error?.message || err?.message || 'Failed to send reset link.';
        this.toastService.show(typeof errorDetail === 'string' ? errorDetail : 'Failed to send reset link.', 'error');
        
        this.cdr.detectChanges();
      }
    });
  }

  // 🔐 LOGIN FUNCTION
  onLogin() {
    if (this.isLoginLoading) return;

    this.loginErrorMessage = '';

    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.isLoginLoading = true;
    this.service.chaneStuLogin(data).subscribe({

        next: (res: any) => {
  this.isLoginLoading = false;

  console.log(res);

  // Payment pending
  if (res.payment_required) {

    this.paymentSummary = {
      planName: res.payment?.plan_name,
      taxableAmount: res.payment?.taxable_amount,
      gstAmount: res.payment?.gst_amount,
      totalAmount: res.payment?.total_amount,

      schoolId: res.user.student_id,
      schoolName: res.user.first_name,
      userid: res.user.user_id
    };

    this.closeSignupModal();
    this.showPaymentPopup = true;
    return;
  }

  // Login Success
  sessionStorage.setItem("access_token", res.access_token);
  sessionStorage.setItem('user_id', res.user.user_id.toString());
  sessionStorage.setItem('student_id', res.user.student_id);
  sessionStorage.setItem('school_name', res.user.first_name);
  sessionStorage.setItem('user_type', res.user.user_type || '');
  if (res.user.board) {
    sessionStorage.setItem('user_board', res.user.board);
  }
  this.setPackageStatusFromResponse(res);

  // The login response doesn't reliably include the board, so refresh the
  // full profile now instead of waiting for the next page reload/ngOnInit.
  this.loadLoggedInProfile();

  this.closeSignupModal();

  // Dashboard
  this.router.navigate(['/dashboard']);

},

      error: (err: any) => {
        this.isLoginLoading = false;
        console.log(err);
        const message = this.getApiErrorMessage(err) || "Invalid email or password.";
        this.loginErrorMessage = message;
        this.loginForm.get('password')?.setErrors({ invalidCredentials: true });
        this.loginForm.get('password')?.markAsTouched();
        this.toastService.show(message, 'error');
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
    if (this.isSignupLoading) return;

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

    this.isSignupLoading = true;
    this.service.chaneStuRegister(data).subscribe({
      next: (res: any) => {
        this.isSignupLoading = false;
        // console.log(res);
        const registeredUser = res.user || res;

        if (res.access_token) {
          this.authStorage.setItem('access_token', res.access_token);
        }

        // Session Storage
        this.authStorage.setItem('user_id', String(registeredUser.user_id || registeredUser.id));
        this.authStorage.setItem('student_id', registeredUser.student_id);
        this.authStorage.setItem('user_type', registeredUser.user_type || data.user_type);
        this.authStorage.setItem('school_name', registeredUser.first_name);
        this.setPackageStatusFromResponse(res);

        // Registration response doesn't reliably include the board, so refresh
        // the full profile now instead of waiting for the next page reload/ngOnInit.
        this.loadLoggedInProfile();

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
        this.isSignupLoading = false;
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

    if (this.isPurchasedPlan(this.paymentSummary.planKey)) {
      this.showPaymentPopup = false;
      this.openMessage("This package is already selected.");
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
        this.loadLoggedInProfile();
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
    return this.authStorage.isLoggedIn();
  }

  get userName(): string {
    return this.authStorage.getItem('school_name') || 'User';
  }

  get userType(): string {
    return this.authStorage.getItem('user_type') === 'SCH' ? 'School' : 'Student';
  }

  get userStudentId(): string {
    return this.authStorage.getItem('student_id') || '-';
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
    this.authStorage.clearAuth();
    this.clearAiIframeLoginCookie();
    this.userMenuOpen = false;
    window.location.reload();
  }

  private clearAiIframeLoginCookie(): void {
    document.cookie = `${this.aiIframeLoginCookie}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${this.aiIframeLoginCookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  navigateWithLogin(url: string): void {

    // Home aur login page bina login ke open ho sakte hain
    if (this.publicUrls.includes(this.getRoutePath(url))) {
      this.router.navigateByUrl(url);
      return;
    }

    const token = this.authStorage.getToken();

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

  handleMenuLinkClick(event: Event, url: string, item?: any): void {
    if (!url) return;

    const path = this.getRoutePath(url);

    if (this.publicUrls.includes(path)) {
      return; // Allow standard routerLink navigation
    }

    if (!this.isLoggedIn) {
      event.preventDefault();
      event.stopPropagation();
      this.closeMobileMenu();
      this.openModal('signup');
      return;
    }

    if (item?.boardKey) {
      // Board-specific item: check board match in addition to plan
      if (this.isBoardSubItemLocked(item)) {
        event.preventDefault();
        event.stopPropagation();
        this.closeMobileMenu();
        const userBoard = this.getUserBoard();
        if (!this.hasPlanGroupAccess(item.requiresPlan)) {
          this.openMessage(`Upgrade to the ${this.planGroupLabel(item.requiresPlan)} to access this content.`);
        } else if (userBoard) {
          this.openMessage(`This board content is only available for your registered board (${(sessionStorage.getItem('user_board') || 'your board').toUpperCase()}).`);
        } else {
          this.openMessage(`Upgrade to the ${this.planGroupLabel(item.requiresPlan)} to access this content.`);
        }
        return;
      }
      return; // Board matches — allow navigation
    }

    if (item?.requiresPlan && !this.hasPlanGroupAccess(item.requiresPlan)) {
      event.preventDefault();
      event.stopPropagation();
      this.closeMobileMenu();
      this.openMessage(`Upgrade to the ${this.planGroupLabel(item.requiresPlan)} to access this content.`);
      return;
    }

    if (this.isStudentPanelLoginUrl(url)) {
      event.preventDefault();
      event.stopPropagation();
      this.closeMobileMenu();
      this.openStudentPanelWithAccessToken();
    }
  }
}
