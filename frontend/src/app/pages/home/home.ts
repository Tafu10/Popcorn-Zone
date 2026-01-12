/**
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 * Componenta logica pentru bara de navigare a aplicatiei.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie';
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
  searchTerm: string = '';
  sortKey: string = 'rating';

  constructor(private movieService: MovieService) {}

  ngOnInit() {
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