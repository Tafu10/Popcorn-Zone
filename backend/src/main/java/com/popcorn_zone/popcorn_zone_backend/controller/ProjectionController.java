/** * Clasa pentru gestionarea programului de proiectii, incluzand verificari pentru evitarea suprapunerii filmelor in aceeasi sala.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

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

    @GetMapping("/{movieId}")
    public List<Map<String, Object>> getProjectionsByMovie(@PathVariable int movieId) {
        String sql = """
            SELECT p.id, p.date, p.time, p.projection_type, p.id_hall,
                   h.hall_nr, h.hall_type, l.city 
            FROM public.projections p
            JOIN public.halls h ON p.id_hall = h.id
            JOIN public.locations l ON h.id_location = l.id
            WHERE p.id_movie = ? 
            ORDER BY p.date ASC, p.time ASC
        """;
        return jdbcTemplate.queryForList(sql, movieId);
    }

    @GetMapping("/single/{id}")
    public Map<String, Object> getProjectionById(@PathVariable int id) {
        String sql = """
        SELECT p.id, p.projection_type, h.hall_nr, l.city 
        FROM public.projections p
        JOIN public.halls h ON p.id_hall = h.id
        JOIN public.locations l ON h.id_location = l.id
        WHERE p.id = ?
    """;
        return jdbcTemplate.queryForMap(sql, id);
    }

    @PostMapping
    public ResponseEntity<?> addProjection(@RequestBody Map<String, Object> payload) {
        try {
            Integer movieId = ((Number) payload.get("movieId")).intValue();
            Integer hallId = ((Number) payload.get("hallId")).intValue();
            String date = (String) payload.get("date");
            String startTime = (String) payload.get("time");

            Integer duration = jdbcTemplate.queryForObject(
                    "SELECT duration FROM public.movies WHERE id = ?", Integer.class, movieId);

            String overlapSql = """
                SELECT COUNT(*) FROM public.projections p
                JOIN public.movies m ON p.id_movie = m.id
                WHERE p.id_hall = ? 
                AND p.date = ?::date
                AND (
                    (?::time, (?::time + (? || ' minutes')::interval + '15 minutes'::interval)) 
                    OVERLAPS 
                    (p.time, (p.time + (m.duration || ' minutes')::interval + '15 minutes'::interval))
                )
            """;

            Integer conflicts = jdbcTemplate.queryForObject(overlapSql, Integer.class,
                    hallId, date, startTime, startTime, duration);

            if (conflicts != null && conflicts > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Conflict: The hall is occupied or there is not enough time between screenings!");
            }

            String hallType = jdbcTemplate.queryForObject("SELECT hall_type FROM public.halls WHERE id = ?", String.class, hallId);
            String determinedType = "IMAX".equalsIgnoreCase(hallType) ? "IMAX" : ("VIP".equalsIgnoreCase(hallType) ? "3D" : "2D");

            String insertSql = "INSERT INTO public.projections (id_movie, id_hall, date, time, projection_type) VALUES (?, ?, ?::date, ?::time, ?)";
            jdbcTemplate.update(insertSql, movieId, hallId, date, startTime, determinedType);

            return ResponseEntity.ok().body("{\"message\": \"Showtime added successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProjection(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        try {
            Integer hallId = ((Number) payload.get("hallId")).intValue();
            String date = (String) payload.get("date");
            String startTime = (String) payload.get("time");

            Integer movieId = jdbcTemplate.queryForObject("SELECT id_movie FROM public.projections WHERE id = ?", Integer.class, id);
            Integer duration = jdbcTemplate.queryForObject("SELECT duration FROM public.movies WHERE id = ?", Integer.class, movieId);

            String overlapSql = """
                SELECT COUNT(*) FROM public.projections p
                JOIN public.movies m ON p.id_movie = m.id
                WHERE p.id_hall = ? 
                AND p.date = ?::date
                AND p.id <> ?
                AND (
                    (?::time, (?::time + (? || ' minutes')::interval + '15 minutes'::interval)) 
                    OVERLAPS 
                    (p.time, (p.time + (m.duration || ' minutes')::interval + '15 minutes'::interval))
                )
            """;

            Integer conflicts = jdbcTemplate.queryForObject(overlapSql, Integer.class, hallId, date, id, startTime, startTime, duration);

            if (conflicts != null && conflicts > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflict: The hall is occupied!");
            }

            String hallType = jdbcTemplate.queryForObject("SELECT hall_type FROM public.halls WHERE id = ?", String.class, hallId);
            String determinedType = "IMAX".equalsIgnoreCase(hallType) ? "IMAX" : ("VIP".equalsIgnoreCase(hallType) ? "3D" : "2D");

            String updateSql = "UPDATE public.projections SET id_hall = ?, date = ?::date, time = ?::time, projection_type = ? WHERE id = ?";
            jdbcTemplate.update(updateSql, hallId, date, startTime, determinedType, id);

            return ResponseEntity.ok().body("{\"message\": \"Showtime updated!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProjection(@PathVariable Integer id) {
        jdbcTemplate.update("DELETE FROM public.projections WHERE id = ?", id);
        return ResponseEntity.ok().body("{\"message\": \"Showtime deleted!\"}");
    }
}