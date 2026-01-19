package com.popcorn_zone.popcorn_zone_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
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
        jdbcTemplate.update(sql, movie.get("name"), movie.get("genre"), movie.get("duration"),
                movie.get("releaseYear"), movie.get("description"), movie.get("posterUrl"), movie.get("rating"));
        return ResponseEntity.ok().body("{\"message\": \"Adaugat!\"}");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Integer id) {
        jdbcTemplate.update("DELETE FROM public.projections WHERE id_movie = ?", id);
        jdbcTemplate.update("DELETE FROM public.movies WHERE id = ?", id);
        return ResponseEntity.ok().body("{\"message\": \"Sters!\"}");
    }

    @GetMapping("/recommendations/{userId}")
    public List<Map<String, Object>> getRecommendations(@PathVariable Integer userId) {
        String sqlSmart = """
            SELECT DISTINCT ON (m.id) 
                   m.id, m.name, m.genre, m.poster_url, m.rating,
                   w.name AS reason
            FROM public.movies m
            JOIN (
                SELECT DISTINCT m2.id, m2.name, m2.genre
                FROM public.movies m2
                JOIN public.projections p ON p.id_movie = m2.id
                JOIN public.reservations r ON r.id_projection = p.id
                WHERE r.id_user = ?
            ) w ON (
                m.genre ILIKE '%' || split_part(w.genre, ',', 1) || '%' 
                OR w.genre ILIKE '%' || split_part(m.genre, ',', 1) || '%'
            )
            WHERE m.id NOT IN (
                SELECT DISTINCT m3.id
                FROM public.movies m3
                JOIN public.projections p2 ON p2.id_movie = m3.id
                JOIN public.reservations r2 ON r2.id_projection = p2.id
                WHERE r2.id_user = ?
            )
            ORDER BY m.id, m.rating DESC
            LIMIT 5
        """;

        List<Map<String, Object>> recommendations = new ArrayList<>(jdbcTemplate.queryForList(sqlSmart, userId, userId));

        if (recommendations.size() < 5) {
            int limitNeeded = 5 - recommendations.size();

            String excludedIds = recommendations.isEmpty() ? "-1" :
                    recommendations.stream()
                            .map(r -> r.get("id").toString())
                            .reduce((a, b) -> a + "," + b).orElse("-1");

            String sqlPopular = """
                SELECT id, name, genre, poster_url, rating, 'Popular Choice' as reason
                FROM public.movies
                WHERE id NOT IN (
                    SELECT DISTINCT m3.id
                    FROM public.movies m3
                    JOIN public.projections p2 ON p2.id_movie = m3.id
                    JOIN public.reservations r2 ON r2.id_projection = p2.id
                    WHERE r2.id_user = ?
                )
                AND id NOT IN (%s)
                ORDER BY rating DESC
                LIMIT ?
            """.formatted(excludedIds);

            List<Map<String, Object>> popularMoves = jdbcTemplate.queryForList(sqlPopular, userId, limitNeeded);
            recommendations.addAll(popularMoves);
        }

        return recommendations;
    }

    @GetMapping("/stats/top-revenue")
    public List<Map<String, Object>> getTopRevenueMovies() {
        String sql = """
            SELECT m.name, SUM(r.total_price) as total_revenue
            FROM public.movies m
            JOIN public.projections p ON p.id_movie = m.id
            JOIN public.reservations r ON r.id_projection = p.id
            GROUP BY m.id, m.name
            HAVING SUM(r.total_price) >= (
                SELECT AVG(movie_total) FROM (
                    SELECT SUM(r2.total_price) as movie_total
                    FROM public.reservations r2
                    JOIN public.projections p2 ON r2.id_projection = p2.id
                    GROUP BY p2.id_movie
                ) as sub_stats
            )
            ORDER BY total_revenue DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }
}