package com.portfolio.app.controller;

import com.portfolio.app.entity.Experience;
import com.portfolio.app.repository.ExperienceRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/experience")
@RequiredArgsConstructor
public class AdminExperienceController {

    private final ExperienceRepository experienceRepository;

    @GetMapping
    public List<Experience> getAll() {
        return experienceRepository.findAll();
    }

    @PostMapping
    public Experience create(@Valid @RequestBody Experience experience) {
        experience.setId(null);
        return experienceRepository.save(experience);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> update(@PathVariable Long id, @Valid @RequestBody Experience experience) {
        if (!experienceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        experience.setId(id);
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!experienceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        experienceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
