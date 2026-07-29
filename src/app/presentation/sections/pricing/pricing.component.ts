import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PopupService } from '../../../core/services/popup.service';
import { ApiService } from '../../../core/services/api-service';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

type PlanKey = 'tech' | 'smart' | 'combo';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent {

  @Output() signupClick = new EventEmitter<boolean>();

  constructor(
    private popupService: PopupService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  couponCode = 'TEACH50';
  popupCouponCode = '';

  ngOnInit(): void {
    localStorage.removeItem('discount_tech');
    localStorage.removeItem('discount_smart');
    localStorage.removeItem('discount_combo');
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

  applyCoupon(plan: PlanKey, inputEl: HTMLInputElement): void {

    const code = inputEl.value.trim().toUpperCase();

    if (!code) {
      this.toastService.show('Please enter a coupon code.', 'error');
      return;
    }

    const data = {
      coupon_code: code,
      amount: this.getBasePrice(plan),
      student_id: Number(localStorage.getItem('student_id')) || 0
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
      price: '₹70,000 / Year',
      oldPrice: '₹148937',
      discount: '53% OFF',

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
      price: '₹50,000 / Year',
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

    if (plan && this.plans[plan as keyof typeof this.plans]) {
      const selectedPlan = this.plans[plan as keyof typeof this.plans];
      let amount = 0;

      switch (plan) {
        case 'school':
          amount = 70000;
          break;
        case 'schooltech':
          amount = 50000;
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
        planName: selectedPlan.title,
        taxableAmount,
        gstAmount,
        totalAmount: amount,
        planMonths
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
  }

  applyPopupCoupon(): void {
    const plan = this.selectedPlanKey;
    if (plan !== 'tech' && plan !== 'smart' && plan !== 'combo') return;

    const code = this.popupCouponCode.trim().toUpperCase();
    if (!code) return;

    const data = {
      coupon_code: code,
      amount: this.getBasePrice(plan),
      student_id: Number(localStorage.getItem('student_id')) || 0
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
  }

  getPopupPrice(): number {
    return this.getPrice(this.selectedPlanKey as PlanKey);
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