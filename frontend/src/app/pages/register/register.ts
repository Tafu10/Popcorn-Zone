import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// Importuri necesare pentru componentele Standalone
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesar pentru [(ngModel)]

@Component({
  selector: 'app-register',
  standalone: true, // Specifică faptul că este o componentă Standalone
  imports: [
    CommonModule, // Necesar pentru *ngIf, *ngFor, etc.
    FormsModule   // Necesar pentru formulare
  ],
  templateUrl: './register.html', // Asigură-te că se potrivește cu 'register.html'
  styleUrls: ['./register.css']   // Asigură-te că se potrivește cu 'register.css'
})
export class RegisterComponent {
  // Acesta este obiectul care ține datele din formular
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  // Mesaje pentru utilizator
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // URL-ul backend-ului tău
  private backendUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient, private router: Router) {}

 // ... (păstrează importurile și începutul clasei)

  // ... (păstrează registerData, successMessage, errorMessage, backendUrl, constructor)

  // Funcția care este apelată la trimiterea formularului
  onSubmit() {
    // Resetăm mesajele
    this.successMessage = null;
    this.errorMessage = null;

    this.http.post(this.backendUrl, this.registerData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          // Răspuns de succes (201 CREATED)
          // Afișăm propriul nostru mesaj în engleză
          this.successMessage = 'User registered successfully!'; 
          
          // Opțional: Redirecționează automat la login după 2 secunde
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          // Răspuns de eroare (409 CONFLICT sau altceva)
          if (err.status === 409) {
            // Afișăm propriul nostru mesaj în engleză
            this.errorMessage = 'Email address is already in use!'; 
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
          console.error('Error during registration:', err);
        }
      });
  }

  // Funcție ajutătoare pentru a naviga la login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}