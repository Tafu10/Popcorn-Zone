import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MovieService, Movie } from '../../services/movie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-movies.html',
  styleUrls: ['./admin-movies.css']
})
export class AdminMoviesComponent implements OnInit {
  movies: Movie[] = [];
  isAdmin = false;
  
  // --- INPUTURI FORMULAR ---
  inputTitle = ''; 
  inputYear = 2024;
  inputGenre = '';
  inputPoster = '';
  
  // Câmpuri noi adăugate:
  inputDuration = 120; // Default 120 min
  inputRating = 7.0;   // Default nota 7
  inputDescription = ''; 

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadMovies();
  }

  checkUserRole() {
    const user = this.authService.getUser();
    if (user && user.role === 'admin') {
      this.isAdmin = true;
    }
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
      },
      error: (err) => console.error("Error loading movies:", err)
    });
  }

  onAddMovie() {
    if (this.inputTitle && this.inputGenre) {
      const moviePayload = {
        name: this.inputTitle,
        releaseYear: this.inputYear,
        genre: this.inputGenre,
        // Acum folosim valorile din formular, nu cele fixe
        duration: this.inputDuration, 
        rating: this.inputRating,
        description: this.inputDescription ? this.inputDescription : "No description available.",
        posterUrl: this.inputPoster ? this.inputPoster : null 
      };

      this.movieService.addMovie(moviePayload).subscribe({
        next: () => {
          this.loadMovies();
          // Resetăm formularul complet
          this.inputTitle = '';
          this.inputGenre = '';
          this.inputPoster = '';
          this.inputDescription = '';
          this.inputDuration = 120;
          this.inputRating = 7.0;
        },
        error: (err) => alert("Error adding movie! Check console.")
      });
    } else {
      alert("Please fill in the Title and Genre!");
    }
  }

  onDeleteMovie(id: number) {
    if(confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => this.loadMovies(),
        error: (err) => console.error("Error deleting movie:", err)
      });
    }
  }
}