package com.portfolio.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "education")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    private String degree;
    private String fieldOfStudy;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 1000)
    private String description;

    private String grade;
}
