/** * Entitate care reprezinta un bilet individual emis pentru un loc specific in cadrul unei rezervari.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Relatie de tip Many-to-One: mai multe bilete pot apartine aceleiasi rezervari
    @ManyToOne
    @JoinColumn(name = "id_reservation", nullable = false)
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "id_seat", nullable = false)
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "id_hall", nullable = false)
    private Hall hall;

    @Column(nullable = false)
    private Float price;
}