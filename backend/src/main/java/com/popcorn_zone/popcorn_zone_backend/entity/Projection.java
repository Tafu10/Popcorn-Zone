/** * Clasa entitate care defineste programul de difuzare al filmelor, incluzand data, ora si tipul proiectiei (2D, 3D, IMAX).
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

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
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(name = "projection_type", nullable = false)
    private String projectionType;

    // Corelarea proiectiei cu filmul respectiv din colectie
    @ManyToOne
    @JoinColumn(name = "id_movie", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "id_hall", nullable = false)
    private Hall hall;
}