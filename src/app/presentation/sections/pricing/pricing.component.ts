import { Component, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PopupService } from '../../../core/services/popup.service';
import { ApiService } from '../../../core/services/api-service';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../core/services/auth-storage.service';

type PlanKey = 'tech' | 'smart' | 'combo';
type PackagePlanKey = PlanKey | 'school' | 'schooltech';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() signupClick = new EventEmitter<boolean>();
  @ViewChild('pricingContainer') pricingContainer!: ElementRef<HTMLDivElement>;

  private autoScrollInterval: any = null;

  constructor(
    private popupService: PopupService,
    private apiService: ApiService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private authStorage: AuthStorageService
  ) { }

  couponCode = 'TEACH50';
  popupCouponCode = '';
  profileSummary: {
    name: string;
    studentId: string;
    userType: string;
    course: string;
    duration: string;
    status: string;
  } | null = null;
  private packageStatusVersion = 0;
  private packageStatusListener = (event: Event) => {
    this.packageStatusVersion++;
    const profile = (event as CustomEvent).detail?.profile;
    this.updateProfileSummary(profile);
    this.logPackageMatch(profile);
    this.cdr.markForCheck();
  };

  ngOnInit(): void {
    localStorage.removeItem('discount_tech');
    localStorage.removeItem('discount_smart');
    localStorage.removeItem('discount_combo');
    window.addEventListener('teachly-package-status-changed', this.packageStatusListener);
    this.updateProfileSummary();
    this.logPackageMatch();
  }

  ngOnDestroy(): void {
    window.removeEventListener('teachly-package-status-changed', this.packageStatusListener);
    this.stopAutoScroll();
    document.body.style.overflow = '';
  }

  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  startAutoScroll(): void {
    this.stopAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      if (!this.pricingContainer?.nativeElement) return;
      const el = this.pricingContainer.nativeElement;
      
      // Check if carousel scroll is needed (when overflow exists on mid/mob screens)
      if (el.scrollWidth > el.clientWidth) {
        const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 320;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        
        if (el.scrollLeft + cardWidth >= maxScrollLeft - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 3000);
  }

  stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  planMonths: Record<PlanKey, number> = {
    tech: 1,
    smart: 1,
    combo: 1
  };

  paymentPrices: Record<PlanKey, number> = {
    tech: 1400,
    smart: 1400,
    combo: 3459
  };

  discountedPrices: Record<string, number> = {};

  showOldPrice: Record<PlanKey, boolean> = {
    tech: false,
    smart: false,
    combo: false
  };

  appliedCoupons: Record<PlanKey, string | null> = {
    tech: null,
    smart: null,
    combo: null
  };

  private getBasePrice(plan: PlanKey): number {
    return this.paymentPrices[plan] * this.planMonths[plan];
  }

  private isPackageExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;

    const expiryTime = Date.parse(expiresAt);
    return Number.isFinite(expiryTime) && expiryTime <= Date.now();
  }

  private clearExpiredPackage(): void {
    this.authStorage.setItem('has_active_package', 'false');
    this.authStorage.removeItem('active_package_key');
    this.authStorage.removeItem('active_package_keys');
    this.authStorage.removeItem('active_plan_expiries');
    this.authStorage.removeItem('package_expires_at');
    this.authStorage.removeItem('active_course');
    this.packageStatusVersion++;
  }

  private updateProfileSummary(profile?: any): void {
    const isLoggedIn = this.authStorage.isLoggedIn();
    if (!isLoggedIn && !profile) {
      this.profileSummary = null;
      return;
    }

    const course = profile?.course || profile?.payment?.plan_name || this.authStorage.getItem('active_course') || '-';
    const duration = profile?.duration || profile?.payment?.duration || '-';
    const hasActivePackage = profile?.has_active_package ?? profile?.payment?.has_active_package ?? this.hasActivePackage();

    this.profileSummary = {
      name: profile?.first_name || this.authStorage.getItem('school_name') || 'User',
      studentId: profile?.student_id || this.authStorage.getItem('student_id') || '-',
      userType: profile?.user_type || this.authStorage.getItem('user_type') || '-',
      course,
      duration: duration === '-' ? '-' : `${duration} Month${Number(duration) > 1 ? 's' : ''}`,
      status: hasActivePackage ? 'Active' : 'No active package',
    };
  }

  private logPackageMatch(profile?: any): void {
    const activePackageKeys = this.authStorage.getActivePackageKeys();
    const hasActivePackage = activePackageKeys.length > 0;
    const packageExpiresAt = this.authStorage.getItem('package_expires_at');
    const plans = [
      { key: 'school', title: 'School Plan' },
      { key: 'schooltech', title: 'School Tech Plan' },
      { key: 'tech', title: 'Tech Education Plan' },
      { key: 'smart', title: 'Smart Education Plan' },
      { key: 'combo', title: 'Tech & Smart Education Plan' },
    ];

    console.group('Pricing Section Package Match');
    console.log('Profile/package data:', {
      profile,
      hasActivePackage,
      activePackageKeys,
      packageExpiresAt,
      course: profile?.course || profile?.payment?.plan_name || null,
    });
    console.table(
      plans.map((plan) => ({
        plan_key: plan.key,
        plan_name: plan.title,
        matched_with_bought_package: this.authStorage.isPlanActive(plan.key),
        button_text: this.authStorage.isPlanActive(plan.key) ? 'SELECTED' : 'BUY NOW',
      }))
    );
    console.groupEnd();
  }

  hasActivePackage(): boolean {
    void this.packageStatusVersion;
    if (!this.authStorage.hasActivePackage()) {
      this.clearExpiredPackage();
      return false;
    }

    return true;
  }

  isPurchasedPlan(plan: string): boolean {
    void this.packageStatusVersion;
    return this.authStorage.isPlanActive(plan);
  }

  getBuyButtonText(plan: string): string {
    return this.isPurchasedPlan(plan) ? 'ACTIVE' : 'BUY NOW';
  }

  applyCoupon(plan: PlanKey, inputEl: HTMLInputElement): void {
    if (this.isPurchasedPlan(plan)) return;

    const code = inputEl.value.trim().toUpperCase();

    if (!code) {
      this.toastService.show('Please enter a coupon code.', 'error');
      return;
    }

    const data = {
      coupon_code: code,
      plan_key: plan,
      plan_duration: this.planMonths[plan],
      student_id: Number(this.authStorage.getItem('user_id')) || null,
      amount: this.getBasePrice(plan)
    };

    this.apiService.applyCoopon(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showOldPrice[plan] = true;
          this.discountedPrices[plan] = res.final_amount;
          this.appliedCoupons[plan] = code;
          localStorage.setItem('discount_' + plan, String(res.final_amount));
          this.toastService.show('Coupon applied successfully!', 'success');
        } else {
          this.toastService.show(res.message || 'Invalid coupon code.', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.show(err.error?.detail || 'Failed to apply coupon.', 'error');
      }
    });
  }

  removeCoupon(plan: PlanKey): void {
    this.appliedCoupons[plan] = null;
    this.showOldPrice[plan] = false;
    delete this.discountedPrices[plan];
    localStorage.removeItem('discount_' + plan);
  }

  showPopup = false;
  selectedPlan: any = {};
  selectedPlanKey = 'tech';

  buySelectedPlan(): void {
    if (this.isPurchasedPlan(this.selectedPlanKey)) {
      this.toastService.show('This package is already active until expiry.', 'success');
      return;
    }

    this.showPopup = false;
    switch (this.selectedPlanKey) {
      case 'school':
        this.openModal('signup', true, 'school');
        break;
      case 'schooltech':
        this.openModal('signup', true, 'schooltech');
        break;
      case 'tech':
        this.openModal('signup', false, 'tech');
        break;
      case 'smart':
        this.openModal('signup', false, 'smart');
        break;
      case 'combo':
        this.openModal('signup', false, 'combo');
        break;
    }
  }

  /* ===========================
      PLANS
  ========================== */

  plans = {

    school: {
      type: 'yearly',
      title: 'School Plan',
      price: '₹150,000 / Year',
      oldPrice: '₹148937',
     

      features: [
        {
          title: 'Tech Education Program',
          items: [
            'Artificial Intelligence',
            'Robotics',
            'Coding & Programming',
            'STEM Education',
            'Drone Technology',
            'Electronics & Circuit Design',
            'CAD Design & 3D Modelling',
            'Design Thinking & Innovation',
            'Atal Tinkering Lab (ATL) Support'
          ]
        },
        {
          title: 'Smart Education Program',
          items: [
            'Smart Classroom Solutions',
            'AI-Powered Personalized Learning',
            '24×7 AI Doubt Support',
            'Virtual Science & Mathematics Labs',
            'Foreign Language Learning',
            'Cognitive Skill Assessment',
            'Child Psychology Support',
            'Activity-Based & Experiential Learning',
            'Teacher Training & Professional Development'
          ]
        }
      ]
    },

    schooltech: {
      type: 'yearly',
      title: 'School Tech Plan',
      price: '₹125,000 / Year',
      oldPrice: '106383',
      discount: '53% OFF',

      features: [
        {
          title: 'Tech Education Programs',
          items: [
            'Artificial Intelligence',
            'Robotics',
            'Coding & Programming',
            'STEM Education',
            'Drone Technology',
            'Electronics & Circuit Design',
            'CAD Design & 3D Modelling',
            'Design Thinking & Innovation',
            'Atal Tinkering Lab (ATL) Support'
          ]
        }
      ]
    },

    tech: {
      type: 'monthly',
      title: 'Tech Education Plan',
      price: '₹1400 / Month',
      oldPrice: '1400',
      discount: '50%',

      features: [
        {
          title: 'Tech Education Programs',
          items: [
            'Artificial Intelligence',
            'Robotics',
            'Coding & Programming',
            'STEM Education',
            'Drone Technology',
            'Electronics & Circuit Design',
            'CAD Design & 3D Modelling',
            'Design Thinking & Innovation',
            'Atal Tinkering Lab (ATL) Support'
          ]
        }
      ]
    },

    smart: {
      type: 'monthly',
      title: 'Smart Education Plan',
      price: '₹1400 / Month',
      oldPrice: '1400',
      discount: '50%',

      features: [
        {
          title: 'Smart Education Programs',
          items: [
            'Smart Classroom Solutions',
            'AI-Powered Personalized Learning',
            '24×7 AI Doubt Support',
            'Virtual Science & Mathematics Labs',
            'Foreign Language Learning',
            'Cognitive Skill Assessment',
            'Child Psychology Support',
            'Activity-Based & Experiential Learning',
            'Teacher Training & Professional Development'
          ]
        }
      ]
    },

    combo: {
      type: 'monthly',
      title: 'Tech & Smart Education Plan',
      price: '₹3459 / Month',
      oldPrice: '3459',
      discount: '63%',

      features: [
        {
          title: 'Tech Education Program',
          items: [
            'Artificial Intelligence',
            'Robotics',
            'Coding & Programming',
            'STEM Education',
            'Drone Technology',
            'Electronics & Circuit Design',
            'CAD Design & 3D Modelling',
            'Design Thinking & Innovation',
            'Atal Tinkering Lab (ATL) Support'
          ]
        },
        {
          title: 'Smart Education Program',
          items: [
            'Smart Classroom Solutions',
            'AI-Powered Personalized Learning',
            '24×7 AI Doubt Support',
            'Virtual Science & Mathematics Labs',
            'Foreign Language Learning',
            'Cognitive Skill Assessment',
            'Child Psychology Support',
            'Activity-Based & Experiential Learning',
            'Teacher Training & Professional Development'
          ]
        }
      ]
    }

  };

  openModal(tab: 'login' | 'signup', isSchool: boolean = false, plan?: string): void {
    if (plan && this.isPurchasedPlan(plan)) {
      this.toastService.show('This package is already active until expiry.', 'success');
      return;
    }

    if (plan && this.plans[plan as keyof typeof this.plans]) {
      const selectedPlan = this.plans[plan as keyof typeof this.plans];
      let amount = 0;

      switch (plan) {
        case 'school':
          amount = 150000;
          break;
        case 'schooltech':
          amount = 125000;
          break;
        case 'tech':
        case 'smart':
        case 'combo':
          amount = this.getPrice(plan as PlanKey);
          break;
      }

      const taxableAmount = Math.round(amount / 1.18);
      const gstAmount = Math.round((amount - taxableAmount) * 100) / 100;

      const planMonths = plan === 'school' || plan === 'schooltech' ? 12 : this.planMonths[plan as PlanKey];

      this.popupService.setPopupData({
        planKey: plan as PackagePlanKey,
        planName: selectedPlan.title,
        taxableAmount,
        gstAmount,
        totalAmount: amount,
        planMonths,
        couponCode: plan === 'tech' || plan === 'smart' || plan === 'combo'
          ? this.appliedCoupons[plan as PlanKey]
          : null
      });
    }

    this.signupClick.emit(isSchool);
  }

  openPopup(plan: string): void {
    this.popupCouponCode = this.couponCode;
    this.selectedPlanKey = plan;
    this.selectedPlan = { ...this.plans[plan as keyof typeof this.plans] };

    if (plan === 'tech' || plan === 'smart' || plan === 'combo') {
      this.selectedPlan.price =
        `₹${this.getPrice(plan as PlanKey)} / ${this.getDuration(plan as PlanKey)}`;
    }

    this.showPopup = true;
    document.body.style.overflow = 'hidden';
  }

  applyPopupCoupon(): void {
    const plan = this.selectedPlanKey;
    if (plan !== 'tech' && plan !== 'smart' && plan !== 'combo') return;
    if (this.isPurchasedPlan(plan)) return;

    const code = this.popupCouponCode.trim().toUpperCase();
    if (!code) return;

    const data = {
      coupon_code: code,
      plan_key: plan,
      plan_duration: this.planMonths[plan],
      student_id: Number(this.authStorage.getItem('user_id')) || null,
      amount: this.getBasePrice(plan)
    };

    this.apiService.applyCoopon(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showOldPrice[plan] = true;
          this.discountedPrices[plan] = res.final_amount;
          this.appliedCoupons[plan] = code;
          localStorage.setItem('discount_' + plan, String(res.final_amount));
          this.selectedPlan.price =
            `₹${res.final_amount} / ${this.getDuration(plan)}`;
          this.toastService.show('Coupon applied successfully!', 'success');
        } else {
          this.toastService.show(res.message || 'Invalid coupon code.', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.show(err.error?.detail || 'Failed to apply coupon.', 'error');
      }
    });
  }

  closePopup(): void {
    this.showPopup = false;
    document.body.style.overflow = '';
  }

  getPopupPrice(): number {
    return this.getPrice(this.selectedPlanKey as PlanKey);
  }

  onDurationChange(event: Event): void {
    const month = Number((event.target as HTMLSelectElement).value);
    if (this.selectedPlanKey === 'tech' || this.selectedPlanKey === 'smart' || this.selectedPlanKey === 'combo') {
      this.selectMonth(this.selectedPlanKey as PlanKey, month);
    }
  }

  selectMonth(plan: PlanKey, month: number): void {
    this.planMonths[plan] = month;
    this.showOldPrice[plan] = false;
    localStorage.removeItem('discount_' + plan);
    delete this.discountedPrices[plan];
    this.appliedCoupons[plan] = null;

    if (this.selectedPlanKey === plan) {
      this.selectedPlan = {
        ...this.selectedPlan,
        price: `₹${this.getPrice(plan)} / ${this.getDuration(plan)}`
      };
    }
  }

  getOldPrice(plan: PlanKey): number {
    const oldPrices: Record<PlanKey, number> = {
      tech: 1400,
      smart: 1400,
      combo: 3459
    };
    return oldPrices[plan] * this.planMonths[plan];
  }

  getPriceForMonth(plan: string, month: number): number {
    if (plan === 'school' || plan === 'schooltech') return 0;
    const p = plan as PlanKey;
    return (this.paymentPrices[p] || 0) * month;
  }

  getDuration(plan: PlanKey): string {
    const month = this.planMonths[plan];
    return `${month} Month${month > 1 ? 's' : ''}`;
  }

  getPrice(plan: string): number {
    if (plan === 'school' || plan === 'schooltech') return 0;
    const p = plan as PlanKey;
    const savedAmount = localStorage.getItem('discount_' + p);
    if (savedAmount) {
      const num = Number(savedAmount);
      return isNaN(num) ? this.getBasePrice(p) : num;
    }
    return this.getBasePrice(p);
  }
}
