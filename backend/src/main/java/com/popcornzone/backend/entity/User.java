package com.popcornzone.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entitate care mapează tabela 'users' din baza de date PostgreSQL.
 */
@Entity
@Table(name = "users")
@Data // Adnotare Lombok: generează Getters, Setters, toString, hashCode, equals
@NoArgsConstructor // Adnotare Lombok: constructor fără argumente
@AllArgsConstructor // Adnotare Lombok: constructor cu toate argumentele
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Coloană obligatorie și unică (din specificațiile tale)
    @Column(unique = true, nullable = false)
    private String email;

    // Coloană obligatorie. NOTĂ: În aplicațiile reale, parola trebuie HASH-uită!
    @Column(nullable = false)
    private String password;

    // Mapează first_name din BD la firstName în Java
    @Column(name = "first_name", nullable = false)
    private String firstName;

    // Mapează last_name din BD la lastName în Java
    @Column(name = "last_name", nullable = false)
    private String lastName;

    // Coloană obligatorie, cu o constrângere CHECK ('user', 'admin') în BD
    @Column(nullable = false)
    private String role;

    // created_at este gestionat de obicei direct de BD (DEFAULT now()),
    // dar îl putem include și ca TIMESTAMP dacă dorim să îl citim/scriem din aplicație
    // Dacă îl lași afară, trebuie să te asiguri că BD îl populează corect.
    // Dacă îl incluzi, ar arăta așa:
    // private java.time.Instant createdAt;
}