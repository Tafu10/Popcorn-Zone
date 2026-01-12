/** * Entitate care stocheaza informatiile descriptive ale filmelor din baza de date, inclusiv genul, durata si link-ul catre poster.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

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

    @Column(nullable = false)
    private Integer duration;

    private Float rating;

    @Column(name = "release_year")
    private Integer releaseYear;

    private String description;

    @Column(name = "poster_url")
    private String posterUrl;
}