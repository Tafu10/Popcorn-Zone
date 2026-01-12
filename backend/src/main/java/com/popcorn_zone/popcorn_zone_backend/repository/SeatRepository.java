/** * Interfata pentru accesul la datele referitoare la locurile din salile de cinema.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}