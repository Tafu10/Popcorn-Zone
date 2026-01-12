/**
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 * Componenta logica pentru pagina de administrare a filmelor.
 */

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
  movies: any[] = [];
  halls: any[] = [];
  isAdmin = false;
  editingProjectionId: number | null = null;
  
  inputTitle = ''; inputYear = 2026; inputGenre = ''; inputPoster = '';
  inputDuration = 120; inputRating = 7.0; inputDescription = ''; 

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
        this.movies = data.map(movie => ({
          ...movie,
          draftDate: '',
          draftTime: '',
          draftHallId: null
        }));

        this.movies.forEach(movie => {
          if (movie.id) {
            this.movieService.getProjections(movie.id).subscribe(projs => {
              movie.projections = projs;
            });
          }
        });
      },
      error: (err: any) => console.error("Error loading movies:", err)
    });
  }

  onAddMovie() {
    const payload = { 
      name: this.inputTitle, 
      releaseYear: this.inputYear, 
      genre: this.inputGenre, 
      duration: this.inputDuration, 
      rating: this.inputRating, 
      description: this.inputDescription, 
      posterUrl: this.inputPoster 
    };

    this.movieService.addMovie(payload).subscribe(() => {
      this.loadMovies();
      this.resetMovieForm();
    });
  }

  onAddProjection(movie: any) {
    if (!movie.draftDate || !movie.draftTime || !movie.draftHallId) {
      alert("Please select Date, Time, and Hall!");
      return;
    }
    const payload = { movieId: movie.id, hallId: movie.draftHallId, date: movie.draftDate, time: movie.draftTime };
    this.movieService.addProjection(payload).subscribe({
      next: () => { alert("Showtime added!"); this.loadMovies(); },
      error: (err) => alert(typeof err.error === 'string' ? err.error : "Conflict!")
    });
  }

  onEditProjection(p: any) {
    this.editingProjectionId = p.id;
    p.editDate = p.date;
    p.editTime = p.time;
    p.editHallId = p.id_hall;
  }

  onUpdateProjection(p: any) {
    const payload = { hallId: p.editHallId, date: p.editDate, time: p.editTime };
    this.movieService.updateProjection(p.id, payload).subscribe({
      next: () => {
        alert("Showtime updated!");
        this.editingProjectionId = null;
        this.loadMovies();
      },
      error: (err) => alert(typeof err.error === 'string' ? err.error : "Update failed!")
    });
  }

  onDeleteProjection(id: number) {
    if(confirm("Are you sure you want to delete this showtime?")) {
      this.movieService.deleteProjection(id).subscribe(() => this.loadMovies());
    }
  }

  onDeleteMovie(id: number) {
    if(confirm("WARNING: Deleting this movie will remove all associated showtimes. Continue?")) {
      this.movieService.deleteMovie(id).subscribe(() => this.loadMovies());
    }
  }

  private resetMovieForm() {
    this.inputTitle = ''; this.inputGenre = ''; this.inputPoster = '';
    this.inputDescription = ''; this.inputYear = 2026; 
  }
}