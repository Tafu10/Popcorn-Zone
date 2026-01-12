/**
 * Serviciu pentru gestionarea starii de autentificare a utilizatorului.
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Incearca sa citeasca utilizatorul salvat din memoria browserului
  private getSavedUser() {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  }

  // Initializam starea cu datele din LocalStorage
  private currentUserSubject = new BehaviorSubject<any>(this.getSavedUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  public login(user: any) {
    // Salvam userul pentru a ramane logat si dupa refresh
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public logout() {
    // Stergem datele la deconectare
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