import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PlanCardPreviewComponent } from '../plan-card/plan-card.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { Plan } from '../../../core/services/plan.model';
import { PlansService } from '../../../core/services/plans.service';
import { ApiService } from '../../../core/services/api-service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';

@Component({
  selector: 'app-plan-card-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    PlanCardPreviewComponent,
  ],
  templateUrl: './plan-card-page.component.html',
  styleUrl: './plan-card-page.component.scss',
})

export class PlanCardPageComponent {

  superPlans: Plan[] = [];
  allPlans: Plan[] = [];

  activeDemoPlanIds: number[] = [];

  constructor(
    private plansService: PlansService,
    private apiService: ApiService,
    private authStorage: AuthStorageService
  ) {

    // Featured plans: 19, 20, 21
    this.superPlans = this.plansService.superplans;

    // All plans except 19, 20, 21
    this.allPlans = this.plansService.getFilteredPlans();

    this.loadPlanStatuses();
  }


  private loadPlanStatuses(): void {

    const token = this.authStorage.getToken();

    // User is not logged in
    if (!token) {
      return;
    }

    this.apiService.getProfile(false).subscribe({

      next: (profile) => {

        console.log(
          'PLAN PAGE PROFILE:',
          profile
        );

        // ------------------------------------------
        // ACTIVE DEMO PLAN IDS
        // ------------------------------------------

        this.activeDemoPlanIds =
          profile?.active_demo_plan_ids || [];

        console.log(
          'ACTIVE DEMO PLAN IDS:',
          this.activeDemoPlanIds
        );


        // ------------------------------------------
        // UPDATE ALL PLANS
        // ------------------------------------------

        this.allPlans = this.allPlans.map(plan => ({
          ...plan,

          isDemoActive:
            this.activeDemoPlanIds.includes(plan.id)
        }));


        // ------------------------------------------
        // UPDATE SUPER PLANS
        // ------------------------------------------

        this.superPlans = this.superPlans.map(plan => ({
          ...plan,

          isDemoActive:
            this.activeDemoPlanIds.includes(plan.id)
        }));


        console.log(
          'UPDATED ALL PLANS:',
          this.allPlans
        );

        console.log(
          'UPDATED SUPER PLANS:',
          this.superPlans
        );
      },

      error: (err) => {

        console.error(
          'FAILED TO LOAD PLAN STATUS:',
          err
        );

      }

    });
  }
}