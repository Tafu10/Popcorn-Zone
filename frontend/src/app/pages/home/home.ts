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
      
      // Extragem URL-urile posterelor valide
      let posters = data.map(m => m.posterUrl).filter(url => !!url);
      
      // LOGICĂ UMPLERE COLAJ: Dacă sunt puține filme, duplicăm lista până avem minim 20 de imagini
      if (posters.length > 0) {
        while (posters.length < 20) {
          posters = [...posters, ...posters];
        }
      }
      
      // Amestecăm posterele și tăiem primele 25 pentru un aspect uniform
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