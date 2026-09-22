package com.portfolio.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "social_link")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String platform; // e.g. "LinkedIn", "GitHub", "Twitter", "Instagram"

    @Column(nullable = false)
    private String url;

    private String iconName; // for frontend icon mapping, e.g. "fa-linkedin"
}
