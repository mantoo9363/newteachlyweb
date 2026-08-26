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

<<<<<<< HEAD
  // openSignup() {
  //   this.signupSource.next(true);
  // }
  openSignup(): void {
  console.log('🔥 POPUP SERVICE openSignup()');
  this.signupSource.next(true);
}
=======
  openSignup() {
    this.signupSource.next(true);
  }
>>>>>>> f269645fb14553ae1781b92b4727cb20155bd511

  closeSignup() {
    this.signupSource.next(false);
  }
}