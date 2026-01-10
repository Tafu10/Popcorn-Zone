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
  halls: any[] = [];
  isAdmin = false;
  
  inputTitle = ''; inputYear = 2026; inputGenre = ''; inputPoster = '';
  inputDuration = 120; inputRating = 7.0; inputDescription = ''; 

  newProjDate = ''; 
  newProjTime = ''; 
  newProjType = 'Standard 2D';
  selectedHallId: number | null = null;

  constructor(private movieService: MovieService, private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadMovies();
    this.loadHalls();
  }

  checkUserRole() {
    const user = this.authService.getUser();
    if (user && user.role === 'admin') this.isAdmin = true;
  }

  loadHalls() {
    this.movieService.getAllHalls().subscribe(data => this.halls = data);
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (data: Movie[]) => {
        this.movies = data;
        this.movies.forEach(movie => {
          if (movie.id) {
            this.movieService.getProjections(movie.id).subscribe(projs => movie.projections = projs);
          }
        });
      },
      error: (err: any) => console.error(err)
    });
  }

  onAddMovie() {
    const payload = { name: this.inputTitle, releaseYear: this.inputYear, genre: this.inputGenre, duration: this.inputDuration, rating: this.inputRating, description: this.inputDescription, posterUrl: this.inputPoster };
    this.movieService.addMovie(payload).subscribe(() => {
      this.loadMovies();
      this.resetMovieForm();
    });
  }

// În admin-movies.ts, actualizează metoda onAddProjection:

onAddProjection(movieId: number) {
  if (!this.newProjDate || !this.newProjTime || !this.selectedHallId) {
    alert("Te rugăm să alegi Data, Ora și Sala!");
    return;
  }

  // Debug: vedem exact ce trimitem in consola browserului (F12 -> Console)
  const payload = { 
    movieId, 
    hallId: this.selectedHallId, 
    date: this.newProjDate, 
    time: this.newProjTime, 
    projection_type: this.newProjType 
  };
  console.log("Trimitere payload proiectie:", payload);

  this.movieService.addProjection(payload).subscribe({
    next: () => { 
      alert("Proiecție adăugată cu succes!"); 
      this.loadMovies(); 
      // Resetare campuri
      this.newProjDate = ''; 
      this.newProjTime = ''; 
      this.selectedHallId = null;
    },
    error: (err) => {
      console.error("Eroare detaliata:", err);
      // Afisam mesajul primit de la Java (Conflict sau Eroare SQL)
      const errorText = (typeof err.error === 'string') ? err.error : "Eroare necunoscută la server!";
      alert(errorText); 
    }
  });
}

  onDeleteProjection(id: number) {
    if(confirm("Ștergi proiecția?")) this.movieService.deleteProjection(id).subscribe(() => this.loadMovies());
  }

  onDeleteMovie(id: number) {
    if(confirm("Ștergi filmul?")) this.movieService.deleteMovie(id).subscribe(() => this.loadMovies());
  }

  private resetMovieForm() {
    this.inputTitle = ''; this.inputGenre = ''; this.inputPoster = '';
    this.inputDescription = ''; this.inputYear = 2026; 
  }

  private resetProjForm() {
    this.newProjDate = ''; 
    this.newProjTime = ''; 
    this.selectedHallId = null;
  }
}