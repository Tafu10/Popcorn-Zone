/** * Repository destinat operatiunilor pe baza de date pentru entitatea Hall (Sali de cinema).
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Hall;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HallRepository extends JpaRepository<Hall, Integer> {
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}