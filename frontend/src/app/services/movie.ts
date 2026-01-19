/**
 * Serviciu pentru comunicarea cu API-ul de filme, proiectii si rezervari.
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

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
  projections?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}`);
  }

  getProjections(movieId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projections/${movieId}`);
  }

  getSeatsForProjection(projectionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/seats/${projectionId}`, { withCredentials: true });
  }

  bookSeats(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations`, payload, { withCredentials: true });
  }

  addMovie(movie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/movies`, movie, { withCredentials: true });
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movies/${id}`, { withCredentials: true });
  }

  getAllHalls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/halls`, { withCredentials: true });
  }

  addProjection(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projections`, payload, { withCredentials: true });
  }

  updateProjection(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projections/${id}`, payload, { withCredentials: true });
  }

  deleteProjection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projections/${id}`, { withCredentials: true });
  }

  getUserReservations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/user/${userId}`, { withCredentials: true });
  }

  getProjectionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projections/single/${id}`);
  }

  // --- FIX AICI: Am adaugat /movies in path ---
  getRecommendations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movies/recommendations/${userId}`);
  }

  // --- FIX AICI: Am adaugat /movies in path ---
  getTopRevenueMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movies/stats/top-revenue`);
  }
}