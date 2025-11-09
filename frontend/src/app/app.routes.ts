import { Routes } from '@angular/router';

// --- Importă componentele noi ---
// Eliminăm ".component" din calea de import
import { LoginComponent } from './pages/login/login'; 
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  // --- Adaugă rutele tale aici ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rută implicită
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];