/** * Repository pentru entitatea Location, gestionand informatiile despre cinematografele din diferite orase.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}