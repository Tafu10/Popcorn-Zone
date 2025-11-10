import { Component, OnInit, OnDestroy } from '@angular/core'; // 1. Importă OnInit și OnDestroy
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs'; // 2. Importă Subscription

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy { // 3. Implementează interfețele
  loginData = {
    email: '',
    password: ''
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private backendUrl = 'http://localhost:8080/api/auth/login';

  // 4. Definim o variabilă pentru a ține abonamentul
  private authSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // 5. ngOnInit rulează O SINGURĂ DATĂ când componenta este creată
  ngOnInit(): void {
    // Ne abonăm la serviciul de autentificare
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      // Verificăm dacă starea s-a schimbat în "delogat" (user e null)
      if (!user) {
        // Dacă da, curățăm mesajele
        this.successMessage = null;
        this.errorMessage = null;
      }
    });
  }

  // 6. ngOnDestroy rulează când componenta este distrusă
  ngOnDestroy(): void {
    // Curățăm abonamentul pentru a preveni memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Funcția de submit rămâne neschimbată
  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    this.http.post<any>(this.backendUrl, this.loginData)
      .subscribe({
        next: (user) => {
          this.successMessage = `Login successful! Welcome, ${user.firstName}.`;
          this.authService.login(user);

          setTimeout(() => {
            // Verificăm dacă mesajul de succes încă există înainte de a naviga
            if (this.successMessage) {
                this.router.navigate(['/login']); 
            }
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error('Error during login:', err);
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}