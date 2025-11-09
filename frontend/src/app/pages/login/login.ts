import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';

// Importuri necesare pentru componentele Standalone
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesar pentru [(ngModel)]

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html', // Asigură-te că se potrivește cu 'login.html'
  styleUrls: ['./login.css']   // Asigură-te că se potrivește cu 'login.css'
})
export class LoginComponent {
  // Obiectul care ține datele din formular
  loginData = {
    email: '',
    password: ''
  };

  // Mesaje pentru utilizator
  errorMessage: string | null = null;
  successMessage: string | null = null; // Pentru mesajul "Logged in as..."

  // URL-ul backend-ului
  private backendUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    this.http.post<any>(this.backendUrl, this.loginData) // Așteptăm un obiect User
      .subscribe({
        next: (user) => {
          // Răspuns de succes (200 OK)
          this.successMessage = `Login successful! Welcome, ${user.firstName}.`;
          
          // Într-o aplicație reală, ai salva token-ul utilizatorului aici
          // console.log('User logged in:', user);

          // Redirecționează către un dashboard (momentan, doar reîmprospătăm)
          // setTimeout(() => {
          //   this.router.navigate(['/dashboard']); // Către o viitoare pagină
          // }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          // Răspuns de eroare (401 Unauthorized)
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error('Error during login:', err);
        }
      });
  }

  // Funcție ajutătoare pentru a naviga la înregistrare
  goToRegister() {
    this.router.navigate(['/register']);
  }
}