/** * Interfata pentru gestionarea operatiunilor de baza si a interogarilor native pentru entitatea User.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.repository;

import com.popcorn_zone.popcorn_zone_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Cautare utilizator dupa email pentru procesul de login
    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findByEmail(@Param("email") String email);

    // Salvare utilizator nou folosind un query SQL nativ
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users (email, password, first_name, last_name, role) VALUES (:email, :password, :firstName, :lastName, :role)", nativeQuery = true)
    void saveUserNative(
            @Param("email") String email,
            @Param("password") String password,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("role") String role
    );
}