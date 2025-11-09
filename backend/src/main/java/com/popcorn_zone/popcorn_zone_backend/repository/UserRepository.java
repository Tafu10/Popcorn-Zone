package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository pentru entitatea User.
 * JpaRepository<User, Integer> - Gestionează entitatea 'User' a cărei cheie primară este 'Integer'.
 */
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Spring Data JPA va genera automat interogarea (query)
     * bazată pe numele metodei: "findByEmail".
     * Caută un utilizator în funcție de adresa sa de email.
     *
     * @param email Emailul utilizatorului căutat.
     * @return Un 'Optional' care conține utilizatorul dacă este găsit, sau este gol dacă nu.
     */
    Optional<User> findByEmail(String email);
}