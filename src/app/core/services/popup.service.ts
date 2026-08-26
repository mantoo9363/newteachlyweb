import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private popupDataSource = new BehaviorSubject<any>(null);
  popupData$ = this.popupDataSource.asObservable();

  setPopupData(data: any) {
    this.popupDataSource.next(data);
  }

  // Signup Modal
  private signupSource = new BehaviorSubject<boolean>(false);
  signup$ = this.signupSource.asObservable();

  // openSignup() {
  //   this.signupSource.next(true);
  // }
  openSignup(): void {
  console.log('🔥 POPUP SERVICE openSignup()');
  this.signupSource.next(true);
}

  closeSignup() {
    this.signupSource.next(false);
  }
}