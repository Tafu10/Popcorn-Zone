package com.popcorn_zone.popcorn_zone_backend.controller;

// Importuri noi
import com.popcorn_zone.popcorn_zone_backend.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;

// Importuri existente
import com.popcorn_zone.popcorn_zone_backend.dto.LoginRequest;
import com.popcorn_zone.popcorn_zone_backend.entity.User;
import com.popcorn_zone.popcorn_zone_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Adăugăm PasswordEncoder

    // Actualizăm constructorul pentru a injecta ambele
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Endpoint pentru Înregistrare utilizator nou.
     * Metoda: POST
     * URL: http://localhost:8080/api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {

        // 1. Verificare dacă email-ul este deja folosit
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            // Email-ul există, returnăm eroarea "Conflict" (409)
            return new ResponseEntity<>("Adresa de email este deja folosită!", HttpStatus.CONFLICT);
        }

        // 2. Creare utilizator nou
        User newUser = new User();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setFirstName(registerRequest.getFirstName());
        newUser.setLastName(registerRequest.getLastName());

        // 3. Criptarea parolei (Securitate)
        // Criptăm parola primită înainte de a o salva în BD
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Setăm rolul implicit
        newUser.setRole("user");

        // Salvăm utilizatorul în baza de date
        userRepository.save(newUser);

        // Returnăm un răspuns "Created" (201)
        return new ResponseEntity<>("Utilizator înregistrat cu succes!", HttpStatus.CREATED);
    }

    /**
     * Endpoint pentru Login.
     * Metoda: POST
     * URL: http://localhost:8080/api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        // 4. Verificare securizată a parolei la login
        // Folosim .matches() pentru a compara parola necriptată din cerere
        // cu parola criptată (hash) din baza de date.
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

            // Securitate: Nu trimitem parola înapoi
            user.setPassword(null);

            // Returnăm "200 OK" și un mesaj de succes + datele utilizatorului
            // (Frontend-ul poate folosi asta pentru mesajul "Autentificat ca...")
            return ResponseEntity.ok(user);
        } else {
            // Date greșite
            return ResponseEntity.status(401).body("Date de autentificare invalide.");
        }
    }
}