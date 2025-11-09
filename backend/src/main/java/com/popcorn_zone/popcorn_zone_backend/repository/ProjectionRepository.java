package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Projection;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Projection.
 */
public interface ProjectionRepository extends JpaRepository<Projection, Integer> {
    // Metodele CRUD de bază sunt moștenite automat
}