import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { MovieService } from '../../services/movie';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginData = { email: '', password: '' };
  collagePosters: string[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private backendUrl = 'http://localhost:8080/api/auth/login';
  private authSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService
  ) {}

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

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (!user) { this.successMessage = null; this.errorMessage = null; }
    });
  }

  ngOnDestroy(): void { if (this.authSubscription) this.authSubscription.unsubscribe(); }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    this.http.post<any>(this.backendUrl, this.loginData).subscribe({
      next: (user) => {
        this.successMessage = `Login successful! Welcome, ${user.firstName}.`;
        this.authService.login(user);
        setTimeout(() => this.router.navigate([user.role === 'admin' ? '/admin-movies' : '/']), 2000);
      },
      error: () => this.errorMessage = 'Invalid email or password.'
    });
  }

  goToRegister() { this.router.navigate(['/register']); }
}