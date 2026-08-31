
import { CommonModule } from '@angular/common';
import { Component, Input ,OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PlansService } from '../../../core/services/plans.service';
import { Plan } from '../../../core/services/plan.model';
import { ApiService } from '../../../core/services/api-service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';

type Validity = 1 | 3 | 6 | 12;

interface ValidityOption {
  label: string;
  months: Validity;
}

const VALIDITY_OPTIONS: ValidityOption[] = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '12M', months: 12 },
];

@Component({
  selector: 'app-plan-card-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './plan-card.component.html',
  styleUrl: './plan-card.component.scss',
})
export class PlanCardPreviewComponent {

  @Input({ required: true })
  plan!: Plan;

  readonly validityOptions = VALIDITY_OPTIONS;

  selectedValidity: Validity = 1;

  // ==============================
  // COUPON
  // ==============================

  couponCode = '';

  couponApplied = false;

  couponError = '';

  couponDiscountPercentage = 0;
  activeDemoPlanIds: number[] = [];


  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private authStorage: AuthStorageService,
    private plansService: PlansService,
    private router: Router,
  ) {}

  // ==============================
  // PLAN / PRICING
  // ==============================

  get hasPricing(): boolean {
    return this.plan.finalPrice != null &&
           this.plan.mrp != null;
  }


  get isSuperplan(): boolean {
    return (
      this.plan.id === 19 ||
      this.plan.id === 20 ||
      this.plan.id === 21
    );
  }


  get mrpForValidity(): number | null {

    if (this.plan.mrp == null) {
      return null;
    }

    return this.plan.mrp * this.selectedValidity;
  }


  // ==============================
  // DISCOUNTED PRICE
  // ==============================

  get discountedPriceForValidity(): number | null {

    const originalPrice = this.mrpForValidity;

    if (originalPrice == null) {
      return null;
    }

    // No coupon applied
    if (!this.couponApplied) {
      return originalPrice;
    }

    // Calculate discount from coupon
    const discountAmount =
      originalPrice *
      this.couponDiscountPercentage /
      100;

    const finalPrice =
      originalPrice - discountAmount;

    // Never allow negative price
    return Math.max(0, finalPrice);
  }


  // ==============================
  // DISPLAYED PRICE
  // ==============================

  get displayedPrice(): number | null {

    if (this.couponApplied) {
      return this.discountedPriceForValidity;
    }

    return this.mrpForValidity;
  }


  // ==============================
  // FORMAT PRICE
  // ==============================

  formatInr(value: number | null): string {

    if (value == null) {
      return '';
    }

    return value.toLocaleString('en-IN');
  }


  // ==============================
  // COUPON INPUT
  // ==============================

  onCouponInput(value: string): void {

    this.couponCode = value;

    this.couponError = '';
  }


  // ==============================
  // VALIDITY
  // ==============================

  selectValidity(months: Validity): void {

    this.selectedValidity = months;
  }


  // ==============================
  // APPLY COUPON
  // ==============================

  applyCoupon(): void {

    const token = this.authStorage.getToken();

    if (!token) {
      alert('Please Login/Sign.');
      // ggggj  this.popupService.openSignup();
      return;
    }
 
    // Empty coupon
    if (!this.couponCode.trim()) {

      this.couponError =
        'Enter a coupon code';

      this.couponApplied = false;

      this.couponDiscountPercentage = 0;

      return;
    }


    const coupon =
      this.couponCode
        .trim()
        .toUpperCase();


    this.couponError = '';


    console.log(
      'VALIDATING COUPON:',
      coupon
    );


    this.apiService
      .validateCoupon(coupon)
      .subscribe({

        // ==========================
        // SUCCESS RESPONSE
        // ==========================

        next: (res: any) => {

          console.log(
            'COUPON RESPONSE:',
            res
          );


          if (res?.success === true) {

            this.couponCode =
              res.coupon_code;


            this.couponDiscountPercentage =
              Number(
                res.discount_percentage
              );


            this.couponApplied = true;

            this.couponError = '';


            this.toastService.show(
              `${this.couponDiscountPercentage}% discount applied!`,
              'success'
            );

          }

          // Backend returned unsuccessful response
          else {

            this.couponApplied = false;

            this.couponDiscountPercentage = 0;

            this.couponError =
              res?.message ||
              'Please enter a correct coupon code.';
          }
        },


        // ==========================
        // ERROR RESPONSE
        // ==========================

        error: (err: any) => {

          console.error(
            'COUPON API ERROR:',
            err
          );


          this.couponApplied = false;

          this.couponDiscountPercentage = 0;


          this.couponError =
            err?.error?.detail ||
            err?.error?.message ||
            'Please enter a correct coupon code.';
        }

      });
  }


  // ==============================
  // REMOVE COUPON
  // ==============================

  removeCoupon(): void {

    this.couponCode = '';

    this.couponApplied = false;

    this.couponDiscountPercentage = 0;

    this.couponError = '';
  }
}





