package com.popcornzone.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "projections")
@Data
public class Projection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate date; // Am folosit LocalDate în loc de Datetime

    @Column(nullable = false)
    private LocalTime time; // Am folosit LocalTime în loc de Datetime

    @Column(name = "projection_type", nullable = false)
    private String projectionType;

    // Cheia Străină către Movie
    @ManyToOne
    @JoinColumn(name = "id_movie", nullable = false)
    private Movie movie;

    // Cheia Străină către Hall
    @ManyToOne
    @JoinColumn(name = "id_hall", nullable = false)
    private Hall hall;
}