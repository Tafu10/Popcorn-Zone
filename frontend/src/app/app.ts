import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; 

// --- 1. Importă HeaderComponent ---
import { HeaderComponent } from './components/header/header'; // Verifică calea!

@Component({
  selector: 'app-root', // Acesta este selectorul standard
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent // --- 2. Adaugă HeaderComponent aici ---
  ],
  templateUrl: './app.html', 
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'frontend'; 
}