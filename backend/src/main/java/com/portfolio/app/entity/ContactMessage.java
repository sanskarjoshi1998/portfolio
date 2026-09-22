package com.portfolio.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_message")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderName;

    @Column(nullable = false)
    private String senderEmail;

    @Column(length = 3000, nullable = false)
    private String message;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Builder.Default
    private boolean isRead = false;
}
