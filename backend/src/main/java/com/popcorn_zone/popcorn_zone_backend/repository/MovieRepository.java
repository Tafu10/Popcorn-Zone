package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pentru entitatea Movie.
 */
public interface MovieRepository extends JpaRepository<Movie, Integer> {
    // Nu este nevoie de cod suplimentar aici pentru moment.
    // Avem deja automat: save(), findById(), findAll(), delete(), etc.
}