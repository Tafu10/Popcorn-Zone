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
        String sql = "SELECT id, name, genre, duration, release_year AS \"releaseYear\", " +
                "description, poster_url AS \"posterUrl\", rating FROM public.movies ORDER BY id DESC";
        return jdbcTemplate.queryForList(sql);
    }

    // ACEASTA ESTE METODA CARE LIPSEA:
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
        return ResponseEntity.ok().body("{\"message\": \"Movie added!\"}");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Integer id) {
        jdbcTemplate.update("DELETE FROM public.projections WHERE id_movie = ?", id);
        jdbcTemplate.update("DELETE FROM public.movies WHERE id = ?", id);
        return ResponseEntity.ok().body("{\"message\": \"Movie deleted!\"}");
    }
}