package com.portfolio.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String title; // e.g. "Full Stack Developer"

    @Column(length = 2000)
    private String summary; // "Who I am" bio

    private String city;
    private String country;
    private String email;
    private String phone;

    private String profileImageUrl;
    private String resumeFileUrl; // downloadable PDF resume
}
