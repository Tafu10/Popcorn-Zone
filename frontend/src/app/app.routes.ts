import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies';
import { HomeComponent } from './pages/home/home';
// 1. IMPORTĂ COMPONENTA NOUĂ
import { MovieDetailsComponent } from './pages/movie-details/movie-details'; 

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin-movies', component: AdminMoviesComponent },
    
    // 2. ADAUGĂ RUTA ASTA
    { path: 'movie/:id', component: MovieDetailsComponent }, 

    { path: '**', redirectTo: '' }
];