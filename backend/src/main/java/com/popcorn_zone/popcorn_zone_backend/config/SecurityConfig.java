package com.popcorn_zone.popcorn_zone_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Acesta este "codificatorul" pe care îl vom folosi
     * pentru a cripta parolele înainte de a le salva în BD.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Aici configurăm permisiunile HTTP.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Dezactivăm CSRF (necesar pentru Postman/Frontend)
                .authorizeHttpRequests(authz -> authz
                        // Permitem ORICE cerere (permitAll) către /api/auth/**
                        // Aici se află /api/auth/login și /api/auth/register
                        .requestMatchers("/api/auth/**").permitAll()
                        // Pentru orice altă cerere, utilizatorul trebuie să fie autentificat
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}