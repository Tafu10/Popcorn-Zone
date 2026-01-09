import { Component, OnInit, OnDestroy } from '@angular/core'; // 1. Importă OnInit și OnDestroy
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

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
export class LoginComponent implements OnInit, OnDestroy {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private backendUrl = 'http://localhost:8080/api/auth/login';

  private authSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.successMessage = null;
        this.errorMessage = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    this.http.post<any>(this.backendUrl, this.loginData)
      .subscribe({
        next: (user) => {
          this.successMessage = `Login successful! Welcome, ${user.firstName}.`;
          
          // Salvăm userul în AuthService
          this.authService.login(user);

          // Așteptăm 2 secunde să vadă mesajul, apoi redirecționăm
          setTimeout(() => {
            if (this.successMessage) {
              
              // VERIFICARE ROL ȘI REDIRECȚIONARE
              if (user.role === 'admin') {
                console.log('User is Admin. Redirecting to Admin Panel...');
                this.router.navigate(['/admin-movies']);
              } else {
                console.log('User is Standard. Redirecting to Home...');
                // Aici îl trimiți pe pagina principală (sau unde vrei tu)
                // Dacă nu ai o rută '', poți pune '/admin-movies' temporar și pt useri ca să vezi că merge
                this.router.navigate(['/']); 
              }
              
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