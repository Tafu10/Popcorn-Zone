/** * Entitate care centralizeaza procesul de rezervare, legand utilizatorul de o proiectie specifica si continand detaliile de plata.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "reservations")
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_projection", nullable = false)
    private Projection projection;

    @ManyToOne
    @JoinColumn(name = "id_location", nullable = false)
    private Location location;

    @Column(name = "reservation_date", nullable = false)
    private Instant reservationDate;

    @Column(name = "nr_tickets", nullable = false)
    private Integer nrTickets;

    @Column(name = "total_price", nullable = false)
    private Float totalPrice;

    // Lista de bilete asociate acestei rezervari; stergerea rezervarii va sterge si biletele (cascade)
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}