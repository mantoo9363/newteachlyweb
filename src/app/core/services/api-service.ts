import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = 'https://apifuturexcamp.theteachly.com';
//  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const accessToken = sessionStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken || ''}`
    });
  }

  // ===============================
  // Landing API
  // ===============================
  

  // ===============================
  // School / Student Register
  // ===============================
  chaneStuRegister(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/chanelstu/chanesturegister`,
      data
    );
  }

  // ===============================
  // School / Student Login
  // ===============================
  chaneStuLogin(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/chanelstu/chanestulogin`,
      data
    );
  }

createSchoolOrder(data: any) {
  return this.http.post(
    this.baseUrl + '/school-payment/create-order',
    data,
    { headers: this.getAuthHeaders() }
  );
}

verifySchoolPayment(data: any) {
  return this.http.post(
    this.baseUrl + '/school-payment/verify-payment',
    data,
    { headers: this.getAuthHeaders() }
  );
}

applyCoopon(data: any) {
  return this.http.post(
    this.baseUrl + '/school-payment/apply_coupon',
    data
  );
}
  // Placeholder path — replace with the real profile endpoint once the backend exposes it
  getProfile(): Observable<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any>(`${this.baseUrl}/chanelstu/profile`, {
      headers,
    });
  }

generateTempToken() {
    const accessToken = sessionStorage.getItem('access_token');
    const userId = Number(sessionStorage.getItem('user_id'));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.post<any>(
      `${this.baseUrl}/token/generate-token`,
      {
        user_id: ''
      },
      {
        headers
      }
    );
  }

}
