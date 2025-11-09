package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Ticket.
 */
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    // Metodele CRUD de bază sunt moștenite automat
}