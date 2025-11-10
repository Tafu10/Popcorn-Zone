import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Importăm serviciul (verifică calea!)
import { Observable } from 'rxjs';

// Importuri pentru Standalone
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, // Pentru *ngIf
    RouterLink    // Pentru routerLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  // Definim un observable care va ține datele utilizatorului
  currentUser$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    // Ne "abonăm" la fluxul de date din serviciu
    this.currentUser$ = this.authService.currentUser$;
  }

  // Funcția pe care o vom apela la click pe butonul Logout
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirecționăm la login după logout
  }
}