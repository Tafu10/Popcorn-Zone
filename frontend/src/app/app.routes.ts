import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies';
import { HomeComponent } from './pages/home/home';
import { MovieDetailsComponent } from './pages/movie-details/movie-details';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-movies', component: AdminMoviesComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'seat-selection/:projectionId', component: SeatSelectionComponent },
  { path: '**', redirectTo: '' }
];