/** * Clasa pentru gestionarea colectiei de filme, incluzand operatii de adaugare, stergere si generarea de statistici de venituri.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class MovieController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Map<String, Object>> getAllMovies() {
        // Monitorizam timpul de executie
        long startTime = System.currentTimeMillis();

        String sql = "SELECT id, name, genre, duration, release_year AS \"releaseYear\", " +
                "description, poster_url AS \"posterUrl\", rating FROM public.movies ORDER BY id DESC";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);

        long endTime = System.currentTimeMillis();
        System.out.println("AWJ Audit - Timp executie getAllMovies: " + (endTime - startTime) + "ms");

        return result;
    }

    @GetMapping("/stats/revenue")
    public List<Map<String, Object>> getRevenueStats() {
        // Calculam veniturile generate de fiecare film
        String sql = """
            SELECT m.name, 
                   (SELECT SUM(r.total_price) FROM public.reservations r 
                    WHERE r.id_projection IN (SELECT id FROM public.projections WHERE id_movie = m.id)) as total_revenue
            FROM public.movies m
            ORDER BY total_revenue DESC NULLS LAST
            """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Integer id) {
        try {
            String sql = "SELECT id, name, genre, duration, release_year AS \"releaseYear\", " +
                    "description, poster_url AS \"posterUrl\", rating FROM public.movies WHERE id = ?";
            Map<String, Object> movie = jdbcTemplate.queryForMap(sql, id);
            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Movie not found");
        }
    }

    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody Map<String, Object> movie) {
        String sql = "INSERT INTO public.movies (name, genre, duration, release_year, description, poster_url, rating) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                movie.get("name"),
                movie.get("genre"),
                movie.get("duration"),
                movie.get("releaseYear"),
                movie.get("description"),
                movie.get("posterUrl"),
                movie.get("rating")
        );
        return ResponseEntity.ok().body("{\"message\": \"Adaugat!\"}");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Integer id) {
        // Stergem mai intai proiectiile asociate
        jdbcTemplate.update("DELETE FROM public.projections WHERE id_movie = ?", id);
        jdbcTemplate.update("DELETE FROM public.movies WHERE id = ?", id);
        return ResponseEntity.ok().body("{\"message\": \"Sters!\"}");
    }
}