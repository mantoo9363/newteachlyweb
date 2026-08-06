import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private readonly keys = [
    'access_token',
    'user_id',
    'student_id',
    'school_name',
    'user_type',
    'has_active_package',
    'active_package_key',
    'active_package_keys',
    'active_plan_expiries',
    'package_expires_at',
    'active_course',
    'student_panel_sso_at',
    'last_temp_token',
    'last_temp_token_created_at',
  ];

  getItem(key: string): string | null {
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue !== null) {
      localStorage.setItem(key, sessionValue);
      return sessionValue;
    }

    const localValue = localStorage.getItem(key);
    if (localValue !== null) {
      sessionStorage.setItem(key, localValue);
    }

    return localValue;
  }

  setItem(key: string, value: string): void {
    if (value == null) {
      this.removeItem(key);
      return;
    }
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }

  clearAuth(): void {
    this.keys.forEach((key) => this.removeItem(key));
  }

  getToken(): string | null {
    return this.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getActivePackageKeys(): string[] {
    const keys = this.parseStringArray(this.getItem('active_package_keys'));
    const fallbackKey = this.getItem('active_package_key');

    if (fallbackKey && !keys.includes(fallbackKey)) {
      keys.push(fallbackKey);
    }

    return keys.filter((key) => this.isPlanActive(key));
  }

  isPlanActive(planKey: string): boolean {
    if (!planKey || this.getItem('has_active_package') !== 'true') return false;

    const keys = this.parseStringArray(this.getItem('active_package_keys'));
    const fallbackKey = this.getItem('active_package_key');
    const hasPlan = keys.includes(planKey) || fallbackKey === planKey;
    if (!hasPlan) return false;

    const expiries = this.parseRecord(this.getItem('active_plan_expiries'));
    const planExpiry = expiries[planKey] || this.getItem('package_expires_at');
    return !this.isExpired(planExpiry);
  }

  hasActivePackage(): boolean {
    return this.getActivePackageKeys().length > 0;
  }

  // 'school' is an all-access plan. 'schooltech' unlocks all tech content.
  hasAllAccessPlan(): boolean {
    return this.getActivePackageKeys().includes('school');
  }

  hasTechAccessPlan(): boolean {
    const activePackageKeys = this.getActivePackageKeys();
    return activePackageKeys.includes('school') || activePackageKeys.includes('schooltech');
  }

  markStudentPanelSso(): void {
    this.setItem('student_panel_sso_at', String(Date.now()));
  }

  wasStudentPanelSsoRecent(maxAgeMs = 5 * 60 * 1000): boolean {
    const ssoAt = Number(this.getItem('student_panel_sso_at'));
    return Number.isFinite(ssoAt) && Date.now() - ssoAt <= maxAgeMs;
  }

  setTempToken(token: string): void {
    this.setItem('last_temp_token', token);
    this.setItem('last_temp_token_created_at', String(Date.now()));
  }

  getRecentTempToken(maxAgeMs = 10 * 60 * 1000): string | null {
    const token = this.getItem('last_temp_token');
    const createdAt = Number(this.getItem('last_temp_token_created_at'));

    if (!token || !Number.isFinite(createdAt) || Date.now() - createdAt > maxAgeMs) {
      return null;
    }

    return token;
  }

  private parseStringArray(value: string | null): string[] {
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
        : [];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  private parseRecord(value: string | null): Record<string, string> {
    if (!value) return {};

    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch {
      return {};
    }
  }

  private isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    const expiryTime = Date.parse(expiresAt);
    return Number.isFinite(expiryTime) && expiryTime <= Date.now();
  }
}
