import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  currentUser$: Observable<any>;
  
  // --- ADĂUGAT ---
  // Ține minte starea meniului mobil (închis implicit)
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  // --- ADĂUGAT ---
  // Funcție pentru a deschide/închide meniul mobil
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // --- ADĂUGAT ---
  // Funcție pentru a închide meniul când dăm click pe un link
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.closeMobileMenu(); // Închide meniul și la logout
    this.router.navigate(['/login']);
  }
}