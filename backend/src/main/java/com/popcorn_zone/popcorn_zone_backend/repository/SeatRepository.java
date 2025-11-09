package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Seat.
 */
public interface SeatRepository extends JpaRepository<Seat, Integer> {
    // Metodele CRUD de bază sunt moștenite automat
}