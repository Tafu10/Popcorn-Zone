package com.popcornzone.backend.entity;

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

    // Cheia Străină către Location
    @ManyToOne
    @JoinColumn(name = "id_location", nullable = false)
    private Location location; // Un Hall aparține unei Location
}