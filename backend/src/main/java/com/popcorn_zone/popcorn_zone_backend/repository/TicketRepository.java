/** * Clasa repository responsabila de stocarea si accesarea biletelor individuale in baza de date.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}