package com.portfolio.app.repository;

import com.portfolio.app.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
}
