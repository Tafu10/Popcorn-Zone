package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Reservation.
 */
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    // Metodele CRUD de bază sunt moștenite automat
}