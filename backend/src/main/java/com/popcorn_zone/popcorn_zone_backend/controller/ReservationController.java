/** * Clasa pentru gestionarea procesului de rezervare a locurilor si emiterea biletelor, asigurand integritatea datelor.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ReservationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/seats/{projectionId}")
    public List<Map<String, Object>> getSeats(@PathVariable int projectionId) {
        // Identificam locurile ocupate
        String sql = """
            SELECT s.id, s.row_nr AS "row", s.number,
                   CASE WHEN t.id IS NOT NULL THEN TRUE ELSE FALSE END AS "isOccupied"
            FROM public.seats s
            JOIN public.projections p ON s.id_hall = p.id_hall
            LEFT JOIN public.tickets t ON s.id = t.id_seat 
                 AND t.id_reservation IN (SELECT id FROM public.reservations WHERE id_projection = ?)
            WHERE p.id = ?
            ORDER BY s.row_nr, s.number
        """;
        return jdbcTemplate.queryForList(sql, projectionId, projectionId);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> makeReservation(@RequestBody Map<String, Object> payload) {
        try {
            Integer userId = (Integer) payload.get("userId");
            Integer projectionId = (Integer) payload.get("projectionId");

            @SuppressWarnings("unchecked")
            List<Integer> seatIds = (List<Integer>) payload.get("seatIds");

            String infoSql = """
            SELECT p.id_hall, p.projection_type, h.id_location 
            FROM public.projections p
            JOIN public.halls h ON p.id_hall = h.id
            WHERE p.id = ?
        """;
            Map<String, Object> projInfo = jdbcTemplate.queryForMap(infoSql, projectionId);

            String type = (String) projInfo.get("projection_type");
            Integer hallId = (Integer) projInfo.get("id_hall");
            Integer locationId = (Integer) projInfo.get("id_location");

            // Stabilim pretul biletului in mod dinamic in functie de formatul filmului
            double pricePerTicket = switch (type.trim().toUpperCase()) {
                case "IMAX" -> 45.0;
                case "3D" -> 35.0;
                default -> 25.0;
            };
            double totalPrice = pricePerTicket * seatIds.size();

            String resSql = "INSERT INTO public.reservations (id_user, id_projection, id_location, nr_tickets, total_price) VALUES (?, ?, ?, ?, ?) RETURNING id";
            Integer reservationId = jdbcTemplate.queryForObject(resSql, Integer.class,
                    userId, projectionId, locationId, seatIds.size(), totalPrice);

            // Inregistram fiecare bilet individual in cadrul aceleiasi rezervari
            String ticketSql = "INSERT INTO public.tickets (id_reservation, id_seat, id_hall, price) VALUES (?, ?, ?, ?)";
            for (Integer seatId : seatIds) {
                jdbcTemplate.update(ticketSql, reservationId, seatId, hallId, pricePerTicket);
            }

            return ResponseEntity.ok().body("{\"message\": \"Success\", \"totalPrice\": " + totalPrice + "}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getUserReservations(@PathVariable int userId) {
        String sql = """
        SELECT 
            r.id AS "reservationId", 
            m.name AS "movieName", 
            p.date, 
            p.time, 
            p.projection_type AS "type",
            h.hall_nr, 
            l.city,
            string_agg(s.row_nr || '-' || s.number, ', ') AS "seats",
            r.total_price AS "totalPrice"
        FROM public.reservations r
        JOIN public.projections p ON r.id_projection = p.id
        JOIN public.movies m ON p.id_movie = m.id
        JOIN public.halls h ON p.id_hall = h.id
        JOIN public.locations l ON h.id_location = l.id
        JOIN public.tickets t ON r.id = t.id_reservation
        JOIN public.seats s ON t.id_seat = s.id
        WHERE r.id_user = ?
        GROUP BY r.id, m.name, p.date, p.time, p.projection_type, h.hall_nr, l.city
        ORDER BY p.date DESC, p.time DESC
    """;
        return jdbcTemplate.queryForList(sql, userId);
    }
}