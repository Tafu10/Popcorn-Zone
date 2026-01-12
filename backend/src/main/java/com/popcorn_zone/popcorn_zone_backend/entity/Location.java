/** * Clasa entitate care reprezinta cinematografe, continand detalii despre adresa si orasul in care acestea se afla.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String address;

    private String city;
}