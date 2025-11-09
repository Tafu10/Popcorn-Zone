import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importăm RouterOutlet pentru a putea folosi <router-outlet>
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-root', // Acesta este selectorul standard
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet // Adăugăm RouterOutlet aici
  ],
  templateUrl: './app.html', // Asigură-te că se potrivește cu 'app.html'
  styleUrls: ['./app.css']   // Asigură-te că se potrivește cu 'app.css'
})
export class AppComponent {
  // Momentan, logica e goală, doar ținem titlul
  title = 'frontend'; 
}