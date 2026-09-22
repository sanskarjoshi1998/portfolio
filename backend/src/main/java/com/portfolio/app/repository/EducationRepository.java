package com.portfolio.app.repository;

import com.portfolio.app.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
}
