package com.popcorn_zone.popcorn_zone_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    // Avem nevoie de toate câmpurile pe care le completează utilizatorul
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}