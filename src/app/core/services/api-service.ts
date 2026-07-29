import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //private readonly baseUrl = 'https://apifuturexcamp.theteachly.com';
 private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

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
    data
  );
}

verifySchoolPayment(data: any) {
  return this.http.post(
    this.baseUrl + '/school-payment/verify-payment',
    data
  );
}

applyCoopon(data: any) {
  return this.http.post(
    this.baseUrl + '/school-payment/apply_coupon',
    data
  );
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

