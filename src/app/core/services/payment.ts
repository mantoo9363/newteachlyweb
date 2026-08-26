import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private apiService: ApiService
  ) {}

  startPayment(paymentData: {
    plan_key: string;
    plan_duration: number;
    coupon_code: string | null;
    plan_name: string;
  }): Observable<any> {

    return new Observable(observer => {

      this.apiService.createSchoolOrder({
        plan_key: paymentData.plan_key,
        plan_duration: paymentData.plan_duration,
        coupon_code: paymentData.coupon_code
      }).subscribe({

        next: (order: any) => {

          const options: any = {
            key: order.key,
            currency: order.currency,
            name: 'Teachly',
            description: paymentData.plan_name,
            order_id: order.order_id,

            handler: (response: any) => {

              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };

              this.apiService.verifySchoolPayment(verifyData)
                .subscribe({

                  next: (result: any) => {
                    observer.next(result);
                    observer.complete();
                  },

                  error: (error) => {
                    observer.error(error);
                  }

                });
            },

            modal: {
              ondismiss: () => {
                observer.error({
                  dismissed: true
                });
              }
            }
          };

          const razorpay =
            new (window as any).Razorpay(options);

          razorpay.open();
        },

        error: (error) => {
          observer.error(error);
        }

      });

    });
  }
}