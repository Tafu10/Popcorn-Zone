import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../services/movie';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  
  private searchSubject = new Subject<string>();

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.loadAllMovies();

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.id) {
        this.movieService.getRecommendations(user.id).subscribe({
          next: (data) => this.recommendedMovies = data,
          error: (err) => console.error(err)
        });
      }
    });
  }

  loadAllMovies() {
    this.movieService.getAllMovies().subscribe(data => {
      this.movies = data;
      this.setupCollage(data);
      this.applySort();
    });
  }

  onSearchChange(searchValue: string) {
    this.searchTerm = searchValue; 
    this.searchSubject.next(searchValue);
  }

  performSearch(term: string) {
    if (!term.trim()) {
      this.loadAllMovies();
      return;
    }

    this.movieService.searchMovies(term).subscribe({
      next: (data) => {
        this.movies = data;
        this.applySort();
      },
      error: (err) => console.error(err)
    });
  }

  applySort() {
    this.movies.sort((a, b) => {
      if (this.sortKey === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
  }

  onSortChange() {
    this.applySort();
  }

  private setupCollage(data: any[]) {
    let posters = data.map((m: any) => m.posterUrl || m.poster_url).filter((url: any) => !!url);
    if (posters.length > 0) {
      while (posters.length < 20) {
        posters = [...posters, ...posters];
      }
    }
    this.collagePosters = posters.sort(() => 0.5 - Math.random()).slice(0, 25);
  }
}