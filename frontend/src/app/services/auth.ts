import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // 1. Funcție ajutătoare: Încearcă să citească userul salvat din browser
  private getSavedUser() {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  }

  // 2. IMPORTANT: Inițializăm BehaviorSubject cu ce găsim în LocalStorage
  // (Înainte era "new BehaviorSubject<any>(null)", acum verificăm memoria mai întâi)
  private currentUserSubject = new BehaviorSubject<any>(this.getSavedUser());
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  public login(user: any) {
    // 3. La login, salvăm userul în LocalStorage ("memoria permanentă")
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public logout() {
    // 4. La logout, îl ștergem din LocalStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null); 
  }

  public isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'admin';
  }

  public getUser() {
    return this.currentUserSubject.value;
  }
}