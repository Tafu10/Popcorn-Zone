import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie';
import { Router } from '@angular/router'; // <--- IMPORTANT: Importul Router-ului

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];

  // IMPORTANT: Injectează router-ul în constructor
  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (data) => this.movies = data,
      error: (err) => console.error(err)
    });
  }

  // Această funcție face navigarea efectivă
  onBookTicket(movieId: number) {
    console.log("Navigating to movie:", movieId); // Verifică în consolă (F12) dacă apare asta
    this.router.navigate(['/movie', movieId]);
  }
}