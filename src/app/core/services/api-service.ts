import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly baseUrl = 'https://apifuturexcamp.theteachly.com';
//  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private getAuthHeaders(): HttpHeaders {
    const accessToken = sessionStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken || ''}`,
    });
  }

  chaneStuRegister(data: any): Observable<any> {
    return this.http.post(this.url(API_ENDPOINTS.chanelStudent.register), data);
  }

  chaneStuLogin(data: any): Observable<any> {
    return this.http.post(this.url(API_ENDPOINTS.chanelStudent.login), data);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.url(API_ENDPOINTS.chanelStudent.profile), {
      headers: this.getAuthHeaders(),
    });
  }

  createSchoolOrder(data: any): Observable<any> {
    return this.http.post(this.url(API_ENDPOINTS.schoolPayment.createOrder), data, {
      headers: this.getAuthHeaders(),
    });
  }

  verifySchoolPayment(data: any): Observable<any> {
    return this.http.post(this.url(API_ENDPOINTS.schoolPayment.verifyPayment), data, {
      headers: this.getAuthHeaders(),
    });
  }

  getSchoolPaymentHistory(userId: number): Observable<any> {
    return this.http.get(this.url(API_ENDPOINTS.schoolPayment.history(userId)), {
      headers: this.getAuthHeaders(),
    });
  }

  applyCoopon(data: any): Observable<any> {
    return this.http.post(this.url(API_ENDPOINTS.schoolPayment.applyCoupon), data);
  }

  generateTempToken(): Observable<any> {
    return this.http.post<any>(
      this.url(API_ENDPOINTS.token.generateTempToken),
      { user_id: '' },
      { headers: this.getAuthHeaders() }
    );
  }
}
