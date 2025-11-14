package com.popcorn_zone.popcorn_zone_backend.controller;

import com.popcorn_zone.popcorn_zone_backend.dto.LoginRequest;
import com.popcorn_zone.popcorn_zone_backend.dto.RegisterRequest;
import com.popcorn_zone.popcorn_zone_backend.entity.User;
import com.popcorn_zone.popcorn_zone_backend.repository.UserRepository;

// Importăm adnotarea @Valid
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {

        // Verificare mail
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return new ResponseEntity<>("Adresa de email este deja folosita", HttpStatus.CONFLICT);
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        String role = "user";

        // Inserare
        userRepository.saveUserNative(
                registerRequest.getEmail(),
                encodedPassword,
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                role
        );

        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

            user.setPassword(null);

            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
    }
}