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
    password: '',
    confirmPassword: '' // Am adăugat confirmPassword
  };

  // Mesaje pentru utilizator
  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordErrorMessage: string | null = null; // Mesaj specific pentru parolă

  // URL-ul backend-ului tău
  private backendUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient, private router: Router) {}

  // Funcția care este apelată la trimiterea formularului
  onSubmit() {
    // Resetăm mesajele
    this.successMessage = null;
    this.errorMessage = null;
    this.passwordErrorMessage = null; // Resetează și mesajul parolei

    // --- Verificare suplimentară ÎNAINTE de a trimite la backend ---
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.passwordErrorMessage = 'Passwords do not match!';
      return; // Oprește trimiterea formularului
    }
    // --- Sfârșitul verificării ---

    // Scoatem confirmPassword înainte de a trimite, backend-ul nu are nevoie de el
    const dataToSend = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.http.post(this.backendUrl, dataToSend, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          // Răspuns de succes (201 CREATED)
          this.successMessage = 'User registered successfully!'; 
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          // Răspuns de eroare (409 CONFLICT sau altceva)
          if (err.status === 409) {
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