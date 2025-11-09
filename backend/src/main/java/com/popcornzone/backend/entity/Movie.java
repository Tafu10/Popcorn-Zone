package com.popcornzone.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "movies")
@Data
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String genre;

    // Durata în minute (din schema ta)
    @Column(nullable = false)
    private Integer duration;

    private Float rating;
}