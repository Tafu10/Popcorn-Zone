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

    /**
     * 1. Obține toate locurile pentru o proiecție specifică.
     * Verifică prin JOIN-uri dacă locul are deja un bilet emis pentru proiecția respectivă.
     */
    @GetMapping("/seats/{projectionId}")
    public List<Map<String, Object>> getSeats(@PathVariable int projectionId) {
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

    /**
     * 2. Creează o rezervare nouă.
     * @Transactional asigură că dacă salvarea unui bilet eșuează, nicio dată nu este scrisă în DB.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<?> makeReservation(@RequestBody Map<String, Object> payload) {
        try {
            Integer userId = (Integer) payload.get("userId");
            Integer projectionId = (Integer) payload.get("projectionId");

            @SuppressWarnings("unchecked")
            List<Integer> seatIds = (List<Integer>) payload.get("seatIds");

            Double totalPrice = ((Number) payload.get("totalPrice")).doubleValue();

            // Pasul A: Extragem informațiile despre sală și locație din proiecție
            String infoSql = """
                SELECT p.id_hall, h.id_location 
                FROM public.projections p
                JOIN public.halls h ON p.id_hall = h.id
                WHERE p.id = ?
            """;
            Map<String, Object> projInfo = jdbcTemplate.queryForMap(infoSql, projectionId);

            Integer hallId = (Integer) projInfo.get("id_hall");
            Integer locationId = (Integer) projInfo.get("id_location");

            // Pasul B: Inserăm în tabelul 'reservations' și recuperăm ID-ul generat
            String resSql = """
                INSERT INTO public.reservations (id_user, id_projection, id_location, nr_tickets, total_price) 
                VALUES (?, ?, ?, ?, ?) RETURNING id
            """;
            Integer reservationId = jdbcTemplate.queryForObject(resSql, Integer.class,
                    userId, projectionId, locationId, seatIds.size(), totalPrice);

            // Pasul C: Inserăm fiecare loc selectat ca bilet individual în tabelul 'tickets'
            String ticketSql = "INSERT INTO public.tickets (id_reservation, id_seat, id_hall, price) VALUES (?, ?, ?, ?)";
            double pricePerSeat = totalPrice / seatIds.size();

            for (Integer seatId : seatIds) {
                jdbcTemplate.update(ticketSql, reservationId, seatId, hallId, pricePerSeat);
            }

            return ResponseEntity.ok().body("{\"message\": \"Reservation confirmed!\", \"reservationId\": " + reservationId + "}");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating reservation: " + e.getMessage());
        }
    }
}