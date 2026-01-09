import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
      },
      error: (err) => console.error("Error loading movies:", err)
    });
  }

  onBookTicket(movieName: string) {
    alert(`Booking ticket for: ${movieName} \n(Coming Soon!) 🎟️`);
  }
}