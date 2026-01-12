/**
 * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 * Definirea rutelor pentru aplicatia Angular.
 */

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies';
import { MovieDetailsComponent } from './pages/movie-details/movie-details';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection';
import { MyReservationsComponent } from './pages/my-reservations/my-reservations'; // Importul nou

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-movies', component: AdminMoviesComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'seat-selection/:projectionId', component: SeatSelectionComponent },
  { path: 'my-reservations', component: MyReservationsComponent }, // Ruta noua
  { path: '**', redirectTo: '' }
];