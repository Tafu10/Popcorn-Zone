import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies';
import { HomeComponent } from './pages/home/home'; // <--- IMPORT

export const routes: Routes = [
    // Când intri pe site (localhost:4200), te duce la Home
    { path: '', component: HomeComponent },
    
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin-movies', component: AdminMoviesComponent },
    
    // Redirectare pentru orice altceva
    { path: '**', redirectTo: '' }
];