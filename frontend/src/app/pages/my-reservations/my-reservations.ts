import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.html',
  styleUrls: ['./my-reservations.css']
})
export class MyReservationsComponent implements OnInit {
  reservations: any[] = [];

  constructor(private movieService: MovieService, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.movieService.getUserReservations(user.id).subscribe(data => {
        this.reservations = data;
      });
    }
  }
}