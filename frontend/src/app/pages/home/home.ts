/**
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 * Componenta logica pentru pagina home a aplicatiei.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  collagePosters: string[] = [];
  
  recommendedMovies: any[] = [];
  currentUser: any = null;

  searchTerm: string = '';
  sortKey: string = 'rating';

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 1. Incarcam toate filmele
    this.movieService.getAllMovies().subscribe(data => {
      this.movies = data;
      
      let posters = data.map((m: any) => m.posterUrl || m.poster_url).filter(url => !!url);
      
      if (posters.length > 0) {
        while (posters.length < 20) {
          posters = [...posters, ...posters];
        }
      }
      
      this.collagePosters = posters.sort(() => 0.5 - Math.random()).slice(0, 25);
    });

    // 2. Verificam userul si aducem recomandarile
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.id) {
        this.movieService.getRecommendations(user.id).subscribe({
          next: (data) => {
            this.recommendedMovies = data;
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  get filteredMovies() {
    return this.movies
      .filter(m => 
        m.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.genre.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (this.sortKey === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
  }
}