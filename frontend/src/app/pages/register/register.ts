import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html', 
  styleUrls: ['./register.css']  
})
export class RegisterComponent implements OnInit {
  registerData = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
  collagePosters: string[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, private movieService: MovieService) {}

  ngOnInit(): void {
    // Încărcăm pozele pentru fundal cu logică de umplere
    this.movieService.getAllMovies().subscribe(data => {
      let posters = data.map(m => m.posterUrl).filter(u => !!u);
      
      if (posters.length > 0) {
        while (posters.length < 20) {
          posters = [...posters, ...posters];
        }
      }
      this.collagePosters = posters.sort(() => 0.5 - Math.random()).slice(0, 25);
    });
  }

  onSubmit() {
    this.passwordErrorMessage = null;
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.passwordErrorMessage = 'Passwords do not match!';
      return;
    }
    this.http.post('http://localhost:8080/api/auth/register', this.registerData, { responseType: 'text' }).subscribe({
      next: () => {
        this.successMessage = 'User registered successfully!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.status === 409 ? 'Email already in use!' : 'Registration failed.';
      }
    });
  }

  goToLogin() { this.router.navigate(['/login']); }
}