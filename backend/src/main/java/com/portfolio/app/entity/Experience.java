package com.portfolio.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "experience")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    private String jobTitle;
    private String location;

    private LocalDate startDate;
    private LocalDate endDate; // null = currently working here

    @Column(length = 2000)
    private String description;

    @Builder.Default
    private boolean currentlyWorking = false;
}
