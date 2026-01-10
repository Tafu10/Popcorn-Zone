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

    // Citire: Aduce Ora, Sala și Orașul prin JOIN
    @GetMapping("/{movieId}")
    public List<Map<String, Object>> getProjectionsByMovie(@PathVariable int movieId) {
        String sql = """
        SELECT p.id, p.date, p.time, p.projection_type, 
               h.hall_nr, h.hall_type, l.city 
        FROM public.projections p
        JOIN public.halls h ON p.id_hall = h.id
        JOIN public.locations l ON h.id_location = l.id
        WHERE p.id_movie = ? 
        ORDER BY p.date ASC, p.time ASC
    """;
        return jdbcTemplate.queryForList(sql, movieId);
    }

    // Adăugare: Verifică dacă sala e liberă (Validare AWJ)
    @PostMapping
    public ResponseEntity<?> addProjection(@RequestBody Map<String, Object> payload) {
        try {
            Integer movieId = ((Number) payload.get("movieId")).intValue();
            Integer hallId = ((Number) payload.get("hallId")).intValue();
            String date = (String) payload.get("date");
            String time = (String) payload.get("time");
            String type = (String) payload.get("projection_type");

            String checkSql = "SELECT COUNT(*) FROM public.projections WHERE id_hall = ? AND date = ?::date AND time = ?::time";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, hallId, date, time);

            if (count != null && count > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflict: Sala e ocupată!");
            }

            String insertSql = "INSERT INTO public.projections (id_movie, id_hall, date, time, projection_type) VALUES (?, ?, ?::date, ?::time, ?)";
            jdbcTemplate.update(insertSql, movieId, hallId, date, time, type);

            return ResponseEntity.ok().body("{\"message\": \"Adăugat!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProjection(@PathVariable Integer id) {
        jdbcTemplate.update("DELETE FROM public.projections WHERE id = ?", id);
        return ResponseEntity.ok().body("{\"message\": \"Sters!\"}");
    }
}