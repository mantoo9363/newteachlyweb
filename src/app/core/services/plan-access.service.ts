import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

import { ApiService } from './api-service';

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

  constructor(private apiService: ApiService) {}

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  hasPurchasedPackage(): boolean {
    if (sessionStorage.getItem('has_active_package') !== 'true') return false;
    return !this.isPackageExpired(sessionStorage.getItem('package_expires_at'));
  }

  hasPlanGroupAccess(group: PlanGroup): boolean {
    if (!this.isLoggedIn() || !this.hasPurchasedPackage()) return false;
    const activePlanKey = sessionStorage.getItem('active_package_key');
    return !!activePlanKey && this.planGroups[group].includes(activePlanKey);
  }

  planGroupLabel(group: PlanGroup): string {
    return this.planGroupLabels[group];
  }

  // Reads the student's class/grade off their profile (confirmed field: class_name, e.g. "Class 5").
  getUserClassLevel(): Observable<string | null> {
    if (!this.classLevel$) {
      this.classLevel$ = this.apiService.getProfile().pipe(
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
