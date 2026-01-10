package com.popcorn_zone.popcorn_zone_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/halls")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class HallController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Map<String, Object>> getAllHalls() {
        // Returneaza id-ul si numarul salii pentru select-ul din Admin
        return jdbcTemplate.queryForList("SELECT id, hall_nr FROM public.halls ORDER BY hall_nr ASC");
    }
}