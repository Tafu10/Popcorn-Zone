package com.popcorn_zone.popcorn_zone_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projections")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectionController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<?> addProjection(@RequestBody Map<String, Object> payload) {
        try {
            Integer movieId = ((Number) payload.get("movieId")).intValue();
            Integer hallId = ((Number) payload.get("hallId")).intValue();
            String date = (String) payload.get("date");
            String time = (String) payload.get("time");
            String type = (String) payload.get("projection_type");

            // VALIDARE: Verificăm dacă sala este liberă (AWJ)
            String sqlCheck = "SELECT COUNT(*) FROM public.projections WHERE id_hall = ? AND date = ?::date AND time = ?::time";
            Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, hallId, date, time);

            if (count != null && count > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflict: Sala este deja ocupată!");
            }

            // INSERARE: SQL PUR (BD)
            String sqlInsert = "INSERT INTO public.projections (id_movie, id_hall, date, time, projection_type) VALUES (?, ?, ?::date, ?::time, ?)";
            jdbcTemplate.update(sqlInsert, movieId, hallId, date, time, type);

            return ResponseEntity.ok("Proiecție salvată!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare SQL: " + e.getMessage());
        }
    }
}