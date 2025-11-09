package com.popcornzone.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "seats")
@Data
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Cheia Străină către Hall (N:1)
    @ManyToOne
    @JoinColumn(name = "id_hall", nullable = false)
    private Hall hall;

    @Column(name = "row_nr", nullable = false)
    private Integer rowNr;

    @Column(nullable = false)
    private Integer number;
}