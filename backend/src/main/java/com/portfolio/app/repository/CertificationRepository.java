package com.portfolio.app.repository;

import com.portfolio.app.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
}
