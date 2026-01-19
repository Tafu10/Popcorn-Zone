import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';
// Importam QR Component
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './my-reservations.html',
  styleUrls: ['./my-reservations.css']
})
export class MyReservationsComponent implements OnInit {
  reservations: any[] = [];
  currentUser: any = null;

  constructor(private movieService: MovieService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.id) {
        this.loadReservations(user.id);
      }
    });
  }

  loadReservations(userId: number) {
    this.movieService.getUserReservations(userId).subscribe(data => {
      this.reservations = data;
    });
  }

  // Generare text QR cu NUMELE USERULUI
  getQrData(res: any): string {
    const movie = res.movieName || res.movie_name || 'Ticket';
    const date = res.date || res.projection_date || '';
    const time = res.time || res.projection_time || '';
    const seats = res.seats || res.seat_numbers || '';
    const total = res.totalPrice || res.total_price || '';
    const hall = res.hall_nr || '';
    
    // Luam numele userului (sau 'Guest' daca nu e incarcat)
    // Verificam atat camelCase cat si snake_case
    const clientName = this.currentUser 
      ? `${this.currentUser.firstName || this.currentUser.first_name} ${this.currentUser.lastName || this.currentUser.last_name}`
      : 'Guest';

    return `POPCORN ZONE\n` +
           `Client: ${clientName}\n` + 
           `Film: ${movie}\n` +
           `Date: ${date} ${time}\n` +
           `Hall: ${hall}\n` +
           `Seats: ${seats}\n` +
           `Ref: #${res.id}`;
  }
}