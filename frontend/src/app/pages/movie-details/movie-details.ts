import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  projections: any[] = []; // Aici stocăm programul
  selectedProjection: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    // Citim ID-ul filmului din URL (ex: /movie/1)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const movieId = Number(id);
      this.loadMovie(movieId);
      this.loadProjections(movieId);
    }
  }

loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe({
      // Specificăm clar că 'data' este de tip 'Movie'
      next: (data: Movie) => this.movie = data,
      // Specificăm că 'err' este de tip 'any'
      error: (err: any) => console.error("Movie not found", err)
    });
  }

  loadProjections(id: number) {
    this.movieService.getProjections(id).subscribe({
      // Aici 'data' este o listă de orice (any[])
      next: (data: any[]) => {
        this.projections = data;
        console.log("Projections loaded:", data);
      },
      error: (err: any) => console.error("Error loading projections", err)
    });
  }

  selectProjection(proj: any) {
    this.selectedProjection = proj;
  }

  onBuyTicket() {
    if (this.selectedProjection) {
      alert(`Booking started for ${this.selectedProjection.time} at ${this.selectedProjection.cinema_name}!`);
    } else {
      alert("Please select a showtime first!");
    }
  }
}