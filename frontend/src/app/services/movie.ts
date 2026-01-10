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
  rating: number;
  projections?: any[]; // Stocăm programul aici după încărcare
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';
  private projectionsUrl = 'http://localhost:8080/api/projections';
  private hallsUrl = 'http://localhost:8080/api/halls';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl, { withCredentials: true });
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getProjections(movieId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.projectionsUrl}/${movieId}`, { withCredentials: true });
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  addMovie(movie: any): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie, { withCredentials: true });
  }

  // GESTIUNE PROIECȚII
  getAllHalls(): Observable<any[]> {
    return this.http.get<any[]>(this.hallsUrl, { withCredentials: true });
  }

  addProjection(payload: any): Observable<any> {
    return this.http.post(this.projectionsUrl, payload, { withCredentials: true });
  }

  deleteProjection(id: number): Observable<any> {
    return this.http.delete(`${this.projectionsUrl}/${id}`, { withCredentials: true });
  }
}