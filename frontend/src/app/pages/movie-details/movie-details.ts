/**
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 * Componenta logica pentru pagina de detalii a unui film din aplicatie.
 */

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
  projections: any[] = [];
  selectedProjection: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const movieId = Number(id);
      this.loadMovie(movieId);
      this.loadProjections(movieId);
    }
  }

  loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (data: Movie) => this.movie = data,
      error: (err: any) => console.error("Movie not found", err)
    });
  }

  loadProjections(id: number) {
    this.movieService.getProjections(id).subscribe({
      next: (data: any[]) => {
        this.projections = data;
      },
      error: (err: any) => console.error("Error loading projections", err)
    });
  }

  selectProjection(proj: any) {
    this.selectedProjection = proj;
  }

  onBuyTicket() {
    if (this.selectedProjection && this.selectedProjection.id) {
      this.router.navigate(['/seat-selection', this.selectedProjection.id]);
    } else {
      alert("Please select a showtime first!");
    }
  }
}