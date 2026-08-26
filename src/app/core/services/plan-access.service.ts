import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

import { ApiService } from './api-service';
import { AuthStorageService } from './auth-storage.service';

export type PlanGroup = 'tech' | 'smart';

// Mirrors header.component.ts's plan-gating logic (planGroups/hasPurchasedPackage/hasPlanGroupAccess)
// so pages outside the header can gate content on the same "tech" / "smart" plan entitlement.
@Injectable({
  providedIn: 'root'
})
export class PlanAccessService {

  private readonly planGroups: Record<PlanGroup, string[]> = {
    tech: ['tech', 'combo'],
    smart: ['smart', 'combo'],
  };

  private readonly planGroupLabels: Record<PlanGroup, string> = {
    tech: 'Tech Education Plan',
    smart: 'Smart Education Plan',
  };

  private classLevel$: Observable<string | null> | undefined;

  constructor(
    private apiService: ApiService,
    private authStorage: AuthStorageService
  ) {}

  isLoggedIn(): boolean {
    return this.authStorage.isLoggedIn();
  }

  hasPurchasedPackage(): boolean {
    return this.authStorage.hasActivePackage();
  }

  hasPlanGroupAccess(group: PlanGroup): boolean {
    if (!this.isLoggedIn() || !this.hasPurchasedPackage()) return false;
    if (this.authStorage.hasAllAccessPlan()) return true;
    if (group === 'tech' && this.authStorage.hasTechAccessPlan()) return true;
    const activePlanKeys = this.authStorage.getActivePackageKeys();
    return activePlanKeys.some((planKey) => this.planGroups[group].includes(planKey));
  }

  planGroupLabel(group: PlanGroup): string {
    return this.planGroupLabels[group];
  }

  // Reads the student's class/grade off their profile (confirmed field: class_name, e.g. "Class 5").
  getUserClassLevel(): Observable<string | null> {
    if (!this.classLevel$) {
      this.classLevel$ = this.apiService.getProfile(false).pipe(
        map(res => this.normalizeClassLevel(res?.class_name ?? null)),
        catchError(() => of(null)),
        shareReplay(1)
      );
    }
    return this.classLevel$;
  }

  private normalizeClassLevel(raw: string | number | null | undefined): string | null {
    if (raw === null || raw === undefined || raw === '') return null;
    const str = String(raw).trim();
    return /^\d+$/.test(str) ? `Class ${str}` : str;
  }

  private isPackageExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    const expiryTime = Date.parse(expiresAt);
    return Number.isFinite(expiryTime) && expiryTime <= Date.now();
  }
}
