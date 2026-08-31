import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../../core/services/popup.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApiService } from '../../../core/services/api-service';
import { Plan } from '../../../core/services/plan.model';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { PlansService } from '../../../core/services/plans.service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { PaymentService } from '../../../core/services/payment';

type Validity = 1 | 3 | 6 | 12;

interface ValidityOption {
  label: string;
  months: Validity;
}

@Component({
  selector: 'app-plan-detail-page',
  standalone: true,

  imports: [
    HeaderComponent, FooterComponent,
    CommonModule,
    FormsModule
  ],

  templateUrl: './plan-detail-page.html',
  styleUrl: './plan-detail-page.scss'
})
export class PlanDetailPageComponent implements OnInit {

  /* ==========================================
     PLAN
  ========================================== */

  plan: Plan | null = null;

  loading = true;


  /* ==========================================
     VALIDITY
  ========================================== */

  readonly validityOptions: ValidityOption[] = [
    {
      label: '1 Month',
      months: 1
    },
    {
      label: '3 Months',
      months: 3
    },
    {
      label: '6 Months',
      months: 6
    },
    {
      label: '12 Months',
      months: 12
    }
  ];

  selectedValidity: Validity = 1;


  /* ==========================================
     COUPON
  ========================================== */

  couponCode = '';

  couponApplied = false;

  couponError = '';

  couponDiscountPercentage = 0;

  activeDemoPlanIds: number[] = [];


  /* ==========================================
     CONSTRUCTOR
  ========================================== */

  constructor(
    private route: ActivatedRoute,
    private plansService: PlansService,
    private router: Router,
    private authStorage: AuthStorageService,
    private apiService: ApiService,
    private toastService: ToastService,
    private paymentService: PaymentService,
    private popupService: PopupService,
  ) {}


  /* ==========================================
     INIT
  ========================================== */

  ngOnInit(): void {

  const pid = this.route.snapshot.paramMap.get('pid');

  console.log('Route PID:', pid);

  if (!pid) {
    this.loading = false;
    return;
  }

  const allPlans: Plan[] = [
    ...this.plansService.superplans,
    ...this.plansService.getFilteredPlans()
  ];

  this.plan =
    allPlans.find(
      p => p.pid.toLowerCase() === pid.toLowerCase()
    ) ?? null;

  console.log('Selected Plan:', this.plan);

  // Plan not found
  if (!this.plan) {
    this.loading = false;
    return;
  }

  // At this point TypeScript knows plan exists
  const currentPlan = this.plan;

  this.apiService.getProfile(false).subscribe({

    next: (profile) => {

      console.log('PROFILE RESPONSE:', profile);

      this.activeDemoPlanIds =
        profile?.active_demo_plan_ids || [];

      console.log(
        'ACTIVE DEMO PLAN IDS:',
        this.activeDemoPlanIds
      );

      currentPlan.isDemoActive =
        this.activeDemoPlanIds.includes(currentPlan.id);

      console.log(
        'CURRENT PLAN ID:',
        currentPlan.id
      );

      console.log(
        'CURRENT PLAN DEMO ACTIVE:',
        currentPlan.isDemoActive
      );

      this.loading = false;
    },

    error: (err) => {

      console.error('PROFILE LOAD ERROR:', err);

      currentPlan.isDemoActive = false;

      this.loading = false;
    }

  });
}


  /* ==========================================
     HIDE START DEMO
  ========================================== */

  get hideStartDemo(): boolean {

    if (!this.plan) {
      return false;
    }

    return [17, 18, 19, 20, 21].includes(this.plan.id);
  }


  /* ==========================================
     SUPER PLAN
  ========================================== */

  get isSuperplan(): boolean {

    if (!this.plan) {
      return false;
    }

    return (
      this.plan.id === 19 ||
      this.plan.id === 20 ||
      this.plan.id === 21
    );
  }


  /* ==========================================
     MRP PRICE
  ========================================== */

  get mrpForValidity(): number | null {

    if (!this.plan || this.plan.mrp == null) {
      return null;
    }

    // Super plans have fixed price
    if (this.isSuperplan) {
      return this.plan.mrp;
    }

    return this.plan.mrp * this.selectedValidity;
  }


  /* ==========================================
     START DEMO
  ========================================== */

  onStartDemo(): void {

  // ------------------------------------------
  // 1. Check login
  // ------------------------------------------

  const token = this.authStorage.getToken();

  console.log('START DEMO TOKEN:', token);

  if (!token) {
    alert('Please Login/Sign Up first to start the demo.');
    return;
  }


  // ------------------------------------------
  // 2. Check selected plan
  // ------------------------------------------

  if (!this.plan) {
    alert('Plan not found.');
    return;
  }


  // ------------------------------------------
  // 3. Get plan ID
  // ------------------------------------------

  const planId = this.plan.id;

  console.log('STARTING DEMO FOR PLAN ID:', planId);
  console.log('PLAN NAME:', this.plan.productName);
  console.log('PLAN ROUTE:', this.plan.demoRoute);


  // ------------------------------------------
  // 4. Call backend
  // ------------------------------------------

  this.apiService.startPlanDemo(planId).subscribe({

    next: (res) => {

      console.log('DEMO RESPONSE:', res);


      // ------------------------------------------
      // NEW DEMO CREATED
      // ------------------------------------------

      if (
        res.success &&
        res.demo_active &&
        res.is_new_demo
      ) {

        // Mark this plan as having an active demo
        if(this.plan){
          this.plan.isDemoActive = true;
        }
          

        this.toastService.show(
          '🎉 Your 3-day demo access has been activated successfully!',
          'success'
        );

        sessionStorage.setItem(
          'demo_plan_id',
          String(planId)
        );


          this.router.navigateByUrl(
            this.plan!.demoRoute
          );

        return;
      }


      // ------------------------------------------
      // EXISTING ACTIVE DEMO
      // ------------------------------------------

      if (
        res.success &&
        res.demo_active &&
        !res.is_new_demo
      ) {

        

        this.toastService.show(
          'You have an active 3 day demo plan.',
          'info'
        );

        return;
      }


      // ------------------------------------------
      // ALREADY USED / EXPIRED
      // ------------------------------------------

      this.toastService.show(
        res?.message ||
        'Demo access is not available.',
        'error'
      );
    },


    // ------------------------------------------
    // API ERROR
    // ------------------------------------------

    error: (err) => {

      console.error('DEMO ERROR:', err);

      this.toastService.show(
        err?.error?.detail ||
        err?.error?.message ||
        'Unable to start demo. Please try again.',
        'error'
      );
    }

  });
}


  /* ==========================================
     BUY NOW
  ========================================== */

  private verifyPayment(response: any): void {

  const data = {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature
  };

  console.log('VERIFY PAYMENT DATA:', data);

  this.apiService.verifySchoolPayment(data).subscribe({

    next: (result: any) => {

      console.log('PAYMENT VERIFIED:', result);

      this.toastService.show(
        result?.message ||
        'Payment successful! Plan purchased successfully.',
        'success'
      );

    },

    error: (err) => {

      console.error(
        'PAYMENT VERIFICATION ERROR:',
        err
      );

      this.toastService.show(
        err?.error?.detail ||
        err?.error?.message ||
        'Payment verification failed.',
        'error'
      );

    }

  });
}

  private openRazorpay(order: any): void {

  const options: any = {

    key: order.key,

    currency: order.currency,

    name: 'Teachly',

    description: this.plan?.productName || 'Plan Purchase',

    order_id: order.order_id,

    handler: (response: any) => {

      console.log(
        'RAZORPAY PAYMENT RESPONSE:',
        response
      );

      this.verifyPayment(response);
    },

    modal: {
      ondismiss: () => {
        console.log('Razorpay checkout closed');
      }
    }

  };

  const razorpay =
    new (window as any).Razorpay(options);

  razorpay.open();
}

//   onBuyNow(): void {

//   // 1. Check login
//   const token = this.authStorage.getToken();

//   console.log('BUY NOW TOKEN:', token);

//   if (!token) {
//     alert('Please Login/Sign Up first to buy this plan.');
//     return;
//   }

//   // 2. Check plan
//   if (!this.plan) {
//     alert('Plan not found.');
//     return;
//   }

//   // 3. Prepare payment data
//   const paymentData = {
//     plan_key: this.plan.pid,
//     plan_duration: this.isSuperplan
//       ? 1
//       : this.selectedValidity,

//     coupon_code: this.couponApplied
//       ? this.couponCode
//       : null,

//     plan_name: this.plan.productName
//   };

//   console.log('PAYMENT DATA:', paymentData);

//   // 4. Start existing Razorpay flow
//   this.paymentService.startPayment(paymentData)
//     .subscribe({

//       next: (res: any) => {

//         console.log('PAYMENT SUCCESS:', res);

//         this.toastService.show(
//           res?.message || 'Payment Successful!',
//           'success'
//         );

//       },

//       error: (err: any) => {

//         console.error('PAYMENT ERROR:', err);

//         if (err?.dismissed) {
//           return;
//         }

//         const message =
//           err?.error?.detail ||
//           err?.error?.message ||
//           'Payment failed. Please try again.';

//         this.toastService.show(
//           message,
//           'error'
//         );
//       }

//     });
// }

  onBuyNow(): void {

  const token = this.authStorage.getToken();

  if (!token) {
    alert('Please Login/Sign Up first to buy this plan.');
    // ggggj  this.popupService.openSignup();
    return;
  }
 

  if (!this.plan) {
    alert('Plan not found.');
    return;
  }

  const data = {
    plan_key: this.plan.backendPlanKey,
    plan_duration: this.isSuperplan
      ? 1
      : this.selectedValidity,
    coupon_code: this.couponApplied
      ? this.couponCode
      : null
  };

  console.log('CREATE ORDER DATA:', data);

  this.apiService.createSchoolOrder(data).subscribe({

    next: (order: any) => {

      console.log('CREATE ORDER RESPONSE:', order);

      this.openRazorpay(order);

    },

    error: (err) => {

      console.error('CREATE ORDER ERROR:', err);

      this.toastService.show(
        err?.error?.detail ||
        err?.error?.message ||
        'Unable to create payment order.',
        'error'
      );

    }

  });
}


  /* ==========================================
     DISCOUNTED PRICE
  ========================================== */

  // get discountedPriceForValidity(): number | null {

  //   if (!this.plan || this.plan.finalPrice == null) {
  //     return null;
  //   }

  //   // Super plans have fixed price
  //   if (this.isSuperplan) {
  //     return this.plan.finalPrice;
  //   }

  //   return this.plan.finalPrice * this.selectedValidity;
  // }

  get discountedPriceForValidity(): number | null {

  const originalPrice = this.mrpForValidity;

  if (originalPrice == null) {
    return null;
  }

  if (!this.couponApplied) {
    return originalPrice;
  }

  const discountAmount =
    originalPrice *
    this.couponDiscountPercentage /
    100;

  return Math.max(
    0,
    originalPrice - discountAmount
  );
}


  /* ==========================================
     DISPLAY PRICE
  ========================================== */

  get displayedPrice(): number | null {

    if (this.couponApplied) {
      return this.discountedPriceForValidity;
    }

    return this.mrpForValidity;
  }


  /* ==========================================
     SELECT VALIDITY
  ========================================== */

  selectValidity(months: Validity): void {

    if (this.isSuperplan) {
      return;
    }

    this.selectedValidity = months;

    console.log(
      'Selected validity:',
      this.selectedValidity,
      'months'
    );

    console.log(
      'New price:',
      this.displayedPrice
    );
  }


  /* ==========================================
     COUPON INPUT
  ========================================== */

  onCouponInput(value: string): void {

    this.couponCode = value;

    this.couponError = '';

    this.couponApplied = false;
  }


  /* ==========================================
     APPLY COUPON
  ========================================== */

  // applyCoupon(): void {

  //   if (!this.couponCode.trim()) {

  //     this.couponError = 'Enter a coupon code';

  //     this.couponApplied = false;

  //     return;
  //   }

  //   this.couponCode =
  //     this.couponCode.trim().toUpperCase();

  //   /*
  //    * Temporary behaviour:
  //    * Any non-empty coupon applies the existing finalPrice.
  //    *
  //    * Replace with backend coupon validation later.
  //    */

  //   this.couponApplied = true;

  //   this.couponError = '';
  // }

  applyCoupon(): void {


  const token = this.authStorage.getToken();

  if (!token) {
    alert('Please Login/SignUp.');
    // ggggj  this.popupService.openSignup();
    return;
  }
 

  if (!this.couponCode.trim()) {
    this.couponError = 'Enter a coupon code';
    this.couponApplied = false;
    this.couponDiscountPercentage = 0;
    return;
  }

  const coupon = this.couponCode.trim().toUpperCase();

  this.couponError = '';

  this.apiService.validateCoupon(coupon).subscribe({

    next: (res: any) => {

      console.log('COUPON RESPONSE:', res);

      if (res.success) {

        this.couponCode = res.coupon_code;

        this.couponDiscountPercentage =
          Number(res.discount_percentage);

        this.couponApplied = true;

        this.couponError = '';

        this.toastService.show(
          `${this.couponDiscountPercentage}% discount applied!`,
          'success'
        );

      } else {

        this.couponApplied = false;
        this.couponDiscountPercentage = 0;

        this.couponError =
          res.message ||
          'Please enter a correct coupon code.';
      }
    },

    error: (err) => {

      console.error('COUPON ERROR:', err);

      this.couponApplied = false;
      this.couponDiscountPercentage = 0;

      this.couponError =
        err?.error?.detail ||
        'Please enter a correct coupon code.';
    }

  });
}


  /* ==========================================
     FORMAT INR
  ========================================== */

  formatInr(value: number | null): string {

    if (value == null) {
      return '';
    }

    return value.toLocaleString('en-IN');
  }


  /* ==========================================
     REMOVE COUPON
  ========================================== */

  removeCoupon(): void {

    this.couponCode = '';

    this.couponApplied = false;

    this.couponError = '';
  }

}