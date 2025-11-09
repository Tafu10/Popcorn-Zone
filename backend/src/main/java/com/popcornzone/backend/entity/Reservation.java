package com.popcornzone.backend.entity;

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

    // Cheia Străină către User (N:1)
    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    // Cheia Străină către Projection (N:1)
    @ManyToOne
    @JoinColumn(name = "id_projection", nullable = false)
    private Projection projection;

    // Cheia Străină către Location (N:1)
    @ManyToOne
    @JoinColumn(name = "id_location", nullable = false)
    private Location location;

    @Column(name = "reservation_date", nullable = false)
    private Instant reservationDate;

    @Column(name = "nr_tickets", nullable = false)
    private Integer nrTickets;

    @Column(name = "total_price", nullable = false)
    private Float totalPrice;

    // Relație 1:N cu Tickets
    // Aceasta este o listă de bilete atașate acestei rezervări.
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}