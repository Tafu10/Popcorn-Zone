/** * Obiect de transfer de date (DTO) utilizat pentru procesul de autentificare, stocand temporar email-ul si parola.
 * * @author Bolat Tayfun
 * @version 12 Ianuarie 2026
 */

package com.popcorn_zone.popcorn_zone_backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}