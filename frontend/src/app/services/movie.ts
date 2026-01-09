import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  name: string;
  releaseYear: number;
  genre: string;
  duration?: number;
  rating?: number;
  description?: string;
  posterUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies'; 

  constructor(private http: HttpClient) { }

  // 1. GET: Aici așteptăm JSON (lista de filme), deci nu schimbăm nimic
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl, { withCredentials: true });
  }

  // 2. POST: Aici adăugăm `responseType: 'text'`
  // Îi spunem Angular-ului că răspunsul "Movie added successfully!" este un text valid, nu o eroare JSON
  addMovie(movie: any): Observable<any> {
    return this.http.post(this.apiUrl, movie, { 
      withCredentials: true, 
      responseType: 'text' // <--- AICI ESTE FIX-UL
    });
  }

  // 3. DELETE: Și aici adăugăm `responseType: 'text'`
  deleteMovie(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { 
      withCredentials: true, 
      responseType: 'text' // <--- AICI ESTE FIX-UL
    });
  }
}