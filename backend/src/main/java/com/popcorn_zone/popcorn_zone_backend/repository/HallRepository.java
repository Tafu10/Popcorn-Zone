package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Hall;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Hall.
 */
public interface HallRepository extends JpaRepository<Hall, Integer> {
    // Metodele CRUD de bază sunt moștenite automat
}