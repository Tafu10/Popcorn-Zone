/** * Repository pentru gestionarea rezervarilor efectuate de catre utilizatori.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}