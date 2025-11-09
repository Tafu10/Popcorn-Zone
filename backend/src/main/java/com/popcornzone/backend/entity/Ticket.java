package com.popcornzone.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_reservation", nullable = false)
    private Reservation reservation; // N:1 cu Reservation

    @ManyToOne
    @JoinColumn(name = "id_seat", nullable = false)
    private Seat seat; // N:1 cu Seat

    @ManyToOne
    @JoinColumn(name = "id_hall", nullable = false)
    private Hall hall; // N:1 cu Hall

    @Column(nullable = false)
    private Float price;
}