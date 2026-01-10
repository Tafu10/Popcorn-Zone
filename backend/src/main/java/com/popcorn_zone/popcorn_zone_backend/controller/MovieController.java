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
        // Citim coloanele si le dam alias-uri sa se potriveasca cu interfata Movie din TS
        String sql = "SELECT id, name, genre, duration, release_year AS \"releaseYear\", " +
                "description, poster_url AS \"posterUrl\", rating FROM public.movies ORDER BY id DESC";
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody Map<String, Object> movie) {
        // Folosim numele campurilor din payload-ul tau din Angular
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
        // IMPORTANT: Stergem intai proiectiile ca sa nu avem eroare de Foreign Key
        jdbcTemplate.update("DELETE FROM public.projections WHERE id_movie = ?", id);
        jdbcTemplate.update("DELETE FROM public.movies WHERE id = ?", id);
        return ResponseEntity.ok().body("{\"message\": \"Sters!\"}");
    }
}