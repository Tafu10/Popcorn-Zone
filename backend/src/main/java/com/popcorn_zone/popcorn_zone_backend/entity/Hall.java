/** * Entitate care mapeaza salile din cadrul locatiilor, specificand numarul salii, capacitatea si dotarile tehnice.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "halls")
@Data
public class Hall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hall_nr", nullable = false)
    private Integer hallNr;

    @Column(name = "nr_of_seats", nullable = false)
    private Integer nrOfSeats;

    @Column(name = "hall_type", nullable = false)
    private String hallType;

    // Un hall apartine intotdeauna unei locatii specifice
    @ManyToOne
    @JoinColumn(name = "id_location", nullable = false)
    private Location location;
}