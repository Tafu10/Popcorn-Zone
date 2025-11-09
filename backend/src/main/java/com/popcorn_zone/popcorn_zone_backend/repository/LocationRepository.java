package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Location.
 */
public interface LocationRepository extends JpaRepository<Location, Integer> {
    // Metodele CRUD de bază sunt moștenite automat
}