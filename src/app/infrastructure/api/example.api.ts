import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExampleApi {
  private apiUrl = `${environment.apiUrl}/example`;

  constructor(private http: HttpClient) {}
}
