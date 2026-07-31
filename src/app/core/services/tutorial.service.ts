import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay, switchMap } from 'rxjs';

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

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
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
      bodyHtml: isPlaceholder ? '' : description,
      status: raw.status === 'published' ? 'published' : 'draft',
      publishedAt: raw.createdAt
    };
  }

  // cadapi ignores the subjectName/status/classLevel query params server-side, so pull a
  // generously large page and filter client-side instead of relying on them.
  getTutorials(page: number, limit: number, status: string, category?: string, classLevel?: string): Observable<Tutorial[]> {
    const params = new HttpParams().set('page', 1).set('limit', 500).set('status', status);

    return this.getCadToken().pipe(
      switchMap(token =>
        this.http.get<TutorialListResponse>(`${this.baseUrl}/tutorial`, { params, headers: this.authHeaders(token) })
      ),
      map(res => {
        let mapped = res.tutorials.map(t => this.mapTutorial(t)).filter(t => t.status === status);
        if (category) {
          const target = normalizeCategory(category);
          mapped = mapped.filter(t => normalizeCategory(t.category) === target);
        }
        if (classLevel) mapped = mapped.filter(t => t.classLevel === classLevel);
        const start = (page - 1) * limit;
        return mapped.slice(start, start + limit);
      })
    );
  }

  getTutorialById(id: string): Observable<Tutorial> {
    return this.getCadToken().pipe(
      switchMap(token =>
        this.http.get<TutorialDetailResponse>(`${this.baseUrl}/tutorial/${id}`, { headers: this.authHeaders(token) })
      ),
      map(raw2 => this.mapTutorial(raw2))
    );
  }
}
