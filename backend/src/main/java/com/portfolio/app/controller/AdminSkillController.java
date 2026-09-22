package com.portfolio.app.controller;

import com.portfolio.app.entity.Skill;
import com.portfolio.app.repository.SkillRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/skills")
@RequiredArgsConstructor
public class AdminSkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    public List<Skill> getAll() {
        return skillRepository.findAll();
    }

    @PostMapping
    public Skill create(@Valid @RequestBody Skill skill) {
        skill.setId(null);
        return skillRepository.save(skill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> update(@PathVariable Long id, @Valid @RequestBody Skill skill) {
        if (!skillRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        skill.setId(id);
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!skillRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        skillRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
