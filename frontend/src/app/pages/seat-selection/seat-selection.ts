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
  ticketPrice = 35.00; // Preț fix per bilet

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Luăm ID-ul proiecției din URL
    const id = this.route.snapshot.paramMap.get('projectionId');
    if (id) {
      this.projectionId = Number(id);
      this.loadSeats();
    }
  }

  loadSeats() {
    this.movieService.getSeatsForProjection(this.projectionId).subscribe({
      next: (data) => this.seats = data,
      error: (err) => console.error("Could not load seats", err)
    });
  }

  toggleSeat(seat: any) {
    if (seat.isOccupied) return;

    if (this.selectedSeats.has(seat)) {
      this.selectedSeats.delete(seat);
    } else {
      this.selectedSeats.add(seat);
    }
  }

  confirmBooking() {
    const user = this.authService.getUser();
    if (!user) {
      alert("Please login to complete the reservation.");
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedSeats.size === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const payload = {
      userId: user.id,
      projectionId: this.projectionId,
      seatIds: Array.from(this.selectedSeats).map(s => s.id),
      totalPrice: this.selectedSeats.size * this.ticketPrice
    };

    this.movieService.bookSeats(payload).subscribe({
      next: (res) => {
        alert("Booking confirmed! Enjoy your movie.");
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        console.error(err);
        alert("Error creating reservation: " + (err.error?.message || "Internal Error"));
      }
    });
  }
}