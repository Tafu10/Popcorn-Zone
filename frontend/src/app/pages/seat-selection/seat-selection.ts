import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.html',
  styleUrls: ['./seat-selection.css']
})
export class SeatSelectionComponent implements OnInit {
  projectionId!: number;
  seats: any[] = [];
  selectedSeats = new Set<any>();
  
  ticketsWanted: number = 1;
  selectionStarted: boolean = false;
  
  // Logica de preț
  pricePerTicket: number = 25; // Default 2D
  projectionType: string = '2D';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectionId = Number(this.route.snapshot.paramMap.get('projectionId'));
    this.loadProjectionDetails();
    this.loadSeats();
  }

loadProjectionDetails() {
  // Apelăm o metodă nouă care aduce datele DOAR pentru proiecția curentă
  this.movieService.getProjectionById(this.projectionId).subscribe({
    next: (current) => {
      if (current) {
        // JdbcTemplate din Backend returnează adesea cheile cu snake_case (projection_type)
        this.projectionType = current.projection_type || current.projectionType || '2D'; 
        
        console.log('Tip proiecție detectat:', this.projectionType);

        // Aplicăm logica de preț în funcție de tipul real detectat
        if (this.projectionType.trim().toUpperCase() === 'IMAX') {
          this.pricePerTicket = 45;
        } else if (this.projectionType.trim().toUpperCase() === '3D') {
          this.pricePerTicket = 35;
        } else {
          this.pricePerTicket = 25;
        }
      } else {
        console.error('Eroare: Datele proiecției nu au putut fi găsite!');
      }
    },
    error: (err) => {
      console.error('Eroare la comunicarea cu serverul:', err);
      // În caz de eroare, rămâne pe prețul default de 25
    }
  });
}

  loadSeats() {
    this.movieService.getSeatsForProjection(this.projectionId).subscribe(data => {
      this.seats = data;
    });
  }

  changeTickets(amount: number) {
    this.ticketsWanted = Math.max(1, Math.min(10, this.ticketsWanted + amount));
  }

  startSelection() {
    this.selectionStarted = true;
  }

  toggleSeat(seat: any) {
    if (seat.isOccupied) return;
    if (this.selectedSeats.has(seat)) {
      this.selectedSeats.delete(seat);
    } else {
      if (this.selectedSeats.size < this.ticketsWanted) {
        this.selectedSeats.add(seat);
      }
    }
  }

  confirmBooking() {
    const user = this.authService.getUser();
    const payload = {
      userId: user.id,
      projectionId: this.projectionId,
      seatIds: Array.from(this.selectedSeats).map(s => s.id),
      totalPrice: this.selectedSeats.size * this.pricePerTicket
    };

    this.movieService.bookSeats(payload).subscribe({
      next: () => {
        alert("Reservation successful! See you at the movies."); // Mesaj simplificat
        this.router.navigate(['/home']);
      }
    });
  }
}