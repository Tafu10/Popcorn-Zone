/** * Repository pentru gestionarea colectiei de filme, permitand accesul la datele salvate in baza de date PostgreSQL.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Integer> {
    // Metodele standard CRUD sunt mostenite automat de la JpaRepository
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}