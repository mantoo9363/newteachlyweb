import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly baseUrl = 'https://apifuturexcamp.theteachly.com';
   // private readonly baseUrl = 'http://127.0.0.1:8000';
  private readonly aiIframeLoginCookie = 'teachly_ai_logged_in';

  constructor(
    private http: HttpClient,
    private authStorage: AuthStorageService
  ) { }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private getAuthHeaders(): HttpHeaders {
    const accessToken = this.authStorage.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken || ''}`,
    });
  }

  private request<T>(source: Observable<T>, logoutOnAuthError = true): Observable<T> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        if (logoutOnAuthError && this.isInvalidTokenError(error)) {
          this.logoutForExpiredToken();
        }

        return throwError(() => error);
      })
    );
  }

  private isInvalidTokenError(error: HttpErrorResponse): boolean {
    return error.status === 401 || error.error?.detail === 'Invalid or expired token';
  }

  private logoutForExpiredToken(): void {
    this.authStorage.clearAuth();
    localStorage.removeItem('teachly_signup_draft');
    this.clearAiIframeLoginCookie();

    if (window.location.pathname !== '/') {
      window.location.href = '/';
      return;
    }

    window.location.reload();
  }

  private clearAiIframeLoginCookie(): void {
    document.cookie = `${this.aiIframeLoginCookie}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${this.aiIframeLoginCookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  chaneStuRegister(data: any): Observable<any> {
    return this.request(this.http.post(this.url(API_ENDPOINTS.chanelStudent.register), data));
  }

  chaneStuLogin(data: any): Observable<any> {
    return this.request(this.http.post(this.url(API_ENDPOINTS.chanelStudent.login), data), false);
  }

  getProfile(): Observable<any> {
    return this.request(
      this.http.get<any>(this.url(API_ENDPOINTS.chanelStudent.profile), {
        headers: this.getAuthHeaders(),
      })
    );
  }

  createSchoolOrder(data: any): Observable<any> {
    return this.request(
      this.http.post(this.url(API_ENDPOINTS.schoolPayment.createOrder), data, {
        headers: this.getAuthHeaders(),
      })
    );
  }

  verifySchoolPayment(data: any): Observable<any> {
    return this.request(
      this.http.post(this.url(API_ENDPOINTS.schoolPayment.verifyPayment), data, {
        headers: this.getAuthHeaders(),
      })
    );
  }

  getSchoolPaymentHistory(userId: number): Observable<any> {
    return this.request(
      this.http.get(this.url(API_ENDPOINTS.schoolPayment.history(userId)), {
        headers: this.getAuthHeaders(),
      })
    );
  }

  applyCoopon(data: any): Observable<any> {
    return this.request(this.http.post(this.url(API_ENDPOINTS.schoolPayment.applyCoupon), data));
  }

  generateTempToken(): Observable<any> {
    return this.request(
      this.http.post<any>(
        this.url(API_ENDPOINTS.token.generateTempToken),
        { user_id: '' },
        { headers: this.getAuthHeaders() }
      )
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.request(
      this.http.post(this.url(API_ENDPOINTS.chanelStudent.forgotPassword), { email }),
      false
    );
  }

  resetPassword(data: any): Observable<any> {
    return this.request(
      this.http.post(this.url(API_ENDPOINTS.chanelStudent.resetPassword), data),
      false
    );
  }

  changePassword(data: any): Observable<any> {
    return this.request(
      this.http.post(this.url(API_ENDPOINTS.chanelStudent.changePassword), data, {
        headers: this.getAuthHeaders(),
      })
    );
  }
}
