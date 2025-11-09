package com.popcorn_zone.popcorn_zone_backend.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) - O clasă simplă
 * folosită doar pentru a transfera datele de login (email și parola)
 * de la Frontend la Backend.
 */
@Data // Adnotarea Lombok care generează automat Getters și Setters
public class LoginRequest {
    private String email;
    private String password;
}