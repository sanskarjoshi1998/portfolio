package com.portfolio.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // BCrypt hashed; null for OAuth2-only accounts

    @Column(unique = true)
    private String email;

    private String fullName;

    private String provider; // "LOCAL" or "GOOGLE"

    @Column(nullable = false)
    @Builder.Default
    private String role = "ROLE_ADMIN";

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;
}
