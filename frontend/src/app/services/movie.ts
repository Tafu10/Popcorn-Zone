import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id?: number;
  name: string;
  genre: string;
  duration: number;
  releaseYear: number;
  description: string;
  posterUrl: string;
  rating: number; // Am pus number, dar merge și float/double din Java
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // Backend-ul tău Java rulează pe portul 8080
  private apiUrl = 'http://localhost:8080/api/movies';
  private projectionsUrl = 'http://localhost:8080/api/projections';

  constructor(private http: HttpClient) {}

  // 1. Ia toate filmele (Home Page)
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl, { withCredentials: true });
  }

  // 2. Ia un singur film după ID (Movie Details) - ASTA LIPSEA
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // 3. Ia programul (Proiecțiile) - ASTA LIPSEA
  getProjections(movieId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.projectionsUrl}/${movieId}`, { withCredentials: true });
  }

  // 4. Șterge film (Admin)
  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // 5. Adaugă film (Admin)
  addMovie(movie: any): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie, { withCredentials: true });
  }
}