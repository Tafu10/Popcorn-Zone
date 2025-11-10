import { Injectable } from '@angular/core';
// BehaviorSubject este un "recipient" special care ne lasă să ținem minte
// cine e logat și să notificăm alte componente când se schimbă
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Asta îl face disponibil în toată aplicația
})
export class AuthService {
  // 1. Stocăm utilizatorul curent. Începe cu 'null' (nelogat).
  private currentUserSubject = new BehaviorSubject<any>(null);

  // 2. Expunem starea ca un "Observable" (un flux de date)
  // HeaderComponent se va "abona" la acest flux.
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  // 3. Metodă pe care o va apela LoginComponent la succes
  public login(user: any) {
    this.currentUserSubject.next(user); // Trimite noul utilizator tuturor "abonaților"
  }

  // 4. Metodă pentru a reseta starea la logout
  public logout() {
    this.currentUserSubject.next(null); // Trimite 'null' (delogat)
  }

  // 5. O funcție ajutătoare pentru a verifica ușor dacă cineva e logat
  public isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}