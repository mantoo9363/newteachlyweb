import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay, switchMap } from 'rxjs';

import { ApiService } from './api-service';

export interface Tutorial {
  id: string;
  title: string;
  category: string;
  classLevel: string;
  type: string;
  isPremium: boolean;
  thumbnail: string;
  heroImage: string;
  videoUrl: string;
  bodyHtml: string;
  status: 'published' | 'draft';
  publishedAt: string; // ISO date, rendered as relative time in the UI
}

interface RawTutorial {
  id: string;
  slug: string;
  subjectName: string;
  classLevel: string;
  pricing: string;
  status: string;
  createdAt: string;
  content: {
    english?: {
      title: string;
      description: string;
      thumbnailUrl: string | null;
      videoUrl: string | null;
    };
  };
}

interface TutorialListResponse {
  ok: boolean;
  tutorials: RawTutorial[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface TutorialDetailResponse extends RawTutorial {
  ok: boolean;
}

const FALLBACK_THUMBNAIL = '/image/DRONE_IMAGE.png';

// cadapi's subjectName values are inconsistent ("Robotic" / "RObotic" instead of "Robotics")
// and it ignores the subjectName/status/classLevel query params server-side (confirmed by
// testing: passing a nonexistent subjectName/classLevel still returns the full list), so once
// live data is back in use, category/status/classLevel need to be filtered client-side, and
// category comparisons should go through this normalizer so "Robotics" matches both variants.
function normalizeCategory(value: string): string {
  const lower = value.trim().toLowerCase();
  return lower.endsWith('s') ? lower.slice(0, -1) : lower;
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private readonly baseUrl = 'https://cadapi.theteachly.com';

  // cadapi.theteachly.com belongs to the same "circuit" service family as circuit.theteachly.com
  // (see curriculum-details.component.ts launchSimulation()) - it doesn't accept the platform's
  // plain sessionStorage access_token, it needs the short-lived circuit temp token instead.
  private tempToken$: Observable<string> | undefined;
  private encryptedEmailId$: Observable<string> | undefined;

  constructor(private http: HttpClient, private apiService: ApiService) {}

  private getCadToken(): Observable<string> {
    if (!this.tempToken$) {
      this.tempToken$ = this.apiService.generateTempToken().pipe(
        map(res => res.temp_token as string),
        shareReplay(1)
      );
    }
    return this.tempToken$;
  }

  private getEncryptedEmailId(): Observable<string> {
    if (!this.encryptedEmailId$) {
      this.encryptedEmailId$ = this.apiService.getProfile().pipe(
        map(profile => this.encryptEmailId(profile?.email || '')),
        shareReplay(1)
      );
    }
    return this.encryptedEmailId$;
  }

  private getCadRequestContext(): Observable<{ token: string; encryptedEmailId: string }> {
    return forkJoin({
      token: this.getCadToken(),
      encryptedEmailId: this.getEncryptedEmailId()
    });
  }

  private authHeaders(token: string, encryptedEmailId: string): HttpHeaders {
    let headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    if (encryptedEmailId) {
      headers = headers.set('X-Encrypted-Email-Id', encryptedEmailId);
    }

    return headers;
  }

  private withEncryptedEmailParam(params: HttpParams, encryptedEmailId: string): HttpParams {
    return encryptedEmailId ? params.set('encrypted_email_id', encryptedEmailId) : params;
  }

  private encryptEmailId(email: string): string {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return '';

    return btoa(unescape(encodeURIComponent(normalizedEmail)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private mapTutorial(raw: RawTutorial): Tutorial {
    const content = raw.content?.english;
    const description = content?.description || '';
    const isPlaceholder = description.replace(/<[^>]*>/g, '').trim().toLowerCase() === 'coming soon';

    return {
      id: raw.id,
      title: content?.title || raw.slug,
      category: raw.subjectName,
      classLevel: raw.classLevel,
      type: 'Reading Lesson',
      isPremium: raw.pricing === 'premium',
      thumbnail: content?.thumbnailUrl || FALLBACK_THUMBNAIL,
      heroImage: content?.thumbnailUrl || FALLBACK_THUMBNAIL,
      videoUrl: content?.videoUrl || '',
      bodyHtml: isPlaceholder ? '' : description,
      status: raw.status === 'published' ? 'published' : 'draft',
      publishedAt: raw.createdAt
    };
  }

  getTutorials(page: number, limit: number, status: string, category?: string, classLevel?: string): Observable<Tutorial[]> {
    let params = new HttpParams().set('page', 1).set('limit', 500).set('status', status);
    if (category) params = params.set('subjectName', category);
    if (classLevel) params = params.set('classLevel', classLevel);

    return this.getCadRequestContext().pipe(
      switchMap(({ token, encryptedEmailId }) =>
        this.http.get<TutorialListResponse>(`${this.baseUrl}/tutorial`, {
          params: this.withEncryptedEmailParam(params, encryptedEmailId),
          headers: this.authHeaders(token, encryptedEmailId)
        })
      ),
      map(res => {
        let mapped = res.tutorials.map(t => this.mapTutorial(t)).filter(t => t.status === status);
        if (category) {
          const target = normalizeCategory(category);
          mapped = mapped.filter(t => normalizeCategory(t.category) === target);
        }
        const start = (page - 1) * limit;
        return mapped.slice(start, start + limit);
      })
    );
  }

  getTutorialById(id: string): Observable<Tutorial> {
    return this.getCadRequestContext().pipe(
      switchMap(({ token, encryptedEmailId }) =>
        this.http.get<TutorialDetailResponse>(`${this.baseUrl}/tutorial/${id}`, {
          params: this.withEncryptedEmailParam(new HttpParams(), encryptedEmailId),
          headers: this.authHeaders(token, encryptedEmailId)
        })
      ),
      map(raw2 => this.mapTutorial(raw2))
    );
  }
}
