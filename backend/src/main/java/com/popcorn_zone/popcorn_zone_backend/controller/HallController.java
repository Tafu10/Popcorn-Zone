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
        // JOIN între săli și locații pentru a vedea orașul în Admin
        String sql = """
            SELECT h.id, h.hall_nr, h.hall_type, l.city 
            FROM public.halls h 
            JOIN public.locations l ON h.id_location = l.id 
            ORDER BY l.city, h.hall_nr
        """;
        return jdbcTemplate.queryForList(sql);
    }
}