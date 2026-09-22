package com.portfolio.app.repository;

import com.portfolio.app.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
