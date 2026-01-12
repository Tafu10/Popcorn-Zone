/** * Interfata repository pentru gestionarea programului de proiectii cinematografice.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.Projection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectionRepository extends JpaRepository<Projection, Integer> {
    // Permite salvarea, actualizarea si stergerea proiectiilor din sistem
    // am scris eu sql nativ asa ca nu am adaugat nimic aici
}