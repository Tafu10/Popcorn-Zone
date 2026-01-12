/** * Clasa entitate pentru gestionarea locurilor disponibile in salile de cinema, definind pozitia acestora prin rand si numar.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "seats")
@Data
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Fiecare loc este asignat unei anumite sali de cinema
    @ManyToOne
    @JoinColumn(name = "id_hall", nullable = false)
    private Hall hall;

    @Column(name = "row_nr", nullable = false)
    private Integer rowNr;

    @Column(nullable = false)
    private Integer number;
}